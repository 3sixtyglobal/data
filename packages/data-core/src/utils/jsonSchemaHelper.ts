// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AsyncCache,
	BaseError,
	Converter,
	GeneralError,
	type IError,
	Is,
	type IValidationFailure,
	JsonHelper,
	SharedStore,
	StringHelper
} from "@twin.org/core";
import { Blake2b } from "@twin.org/crypto";
import type { IEntitySchema } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { FetchHelper, HttpMethod } from "@twin.org/web";
import Ajv2019 from "ajv/dist/2019.js";
import Ajv2020 from "ajv/dist/2020.js";
import type { AnyValidateFunction } from "ajv/dist/core.js";
import formatsPlugin from "ajv-formats";
import { DataTypeHandlerFactory } from "../factories/dataTypeHandlerFactory.js";
import type { ICompiledValidator } from "../models/ICompiledValidator.js";
import type { IJsonSchema } from "../models/IJsonSchema.js";
import type { IJsonSchemaError } from "../models/IJsonSchemaError.js";

/**
 * A helper for JSON schemas.
 */
export class JsonSchemaHelper {
	/**
	 * The schema version 2020 (default).
	 */
	public static readonly SCHEMA_VERSION = "https://json-schema.org/draft/2020-12/schema";

	/**
	 * The schema version 2019.
	 */
	public static readonly SCHEMA_VERSION_2019 = "https://json-schema.org/draft/2019-09/schema";

	/**
	 * The class name.
	 * @internal
	 */
	public static readonly CLASS_NAME = nameof<JsonSchemaHelper>();

	/**
	 * TTL for in-flight / recent compileAsync results in AsyncCache.
	 * @internal
	 */
	private static readonly _COMPILE_CACHE_TTL_MS = 5000;

	/**
	 * Optional loggers for schema loading.
	 * @internal
	 */
	private static _loggers?: {
		loadingSchema?: (uri: string) => Promise<void>;
		schemaLoaded?: (uri: string) => Promise<void>;
		schemaLoadFailed?: (uri: string, error: IError) => Promise<void>;
	};

	/**
	 * Set the loggers used during schema loading.
	 * @param loggers Optional loggers for schema loading, useful when you have a lot of references in your schema and want to track the loading process.
	 * @param loggers.loadingSchema Called when a schema is being loaded.
	 * @param loggers.schemaLoaded Called when a schema has been successfully loaded.
	 * @param loggers.schemaLoadFailed Called when a schema fails to load.
	 */
	public static setLoggers(loggers?: {
		loadingSchema?: (uri: string) => Promise<void>;
		schemaLoaded?: (uri: string) => Promise<void>;
		schemaLoadFailed?: (uri: string, error: IError) => Promise<void>;
	}): void {
		JsonSchemaHelper._loggers = loggers;
	}

	/**
	 * Validates data against the schema.
	 * @param schema The schema to validate the data with.
	 * @param data The data to be validated.
	 * @param additionalTypes Additional types to add for reference, not already in DataTypeHandlerFactory.
	 * @param options Options for the validation.
	 * @param options.throwOnMissing Throw if a referenced schema cannot be loaded, instead of treating it as an empty schema which matches any value, defaults to false.
	 * @returns Result containing errors if there are any.
	 * @throws GeneralError if throwOnMissing is set and a referenced schema cannot be loaded.
	 */
	public static async validate<T = unknown>(
		schema: IJsonSchema,
		data: T,
		additionalTypes?: { [id: string]: IJsonSchema },
		options?: { throwOnMissing?: boolean }
	): Promise<IValidationFailure[]> {
		const throwOnMissing = options?.throwOnMissing ?? false;

		let schemaId = schema.$id;

		if (!Is.stringValue(schemaId)) {
			schemaId = Converter.bytesToHex(
				Blake2b.sum256(Converter.utf8ToBytes(JsonHelper.canonicalize(schema)))
			);
		}

		const is2019Schema = schema.$schema === JsonSchemaHelper.SCHEMA_VERSION_2019;

		const ajv = await JsonSchemaHelper.buildValidator(is2019Schema, throwOnMissing);

		// Add the additional types provided by the user
		if (Is.objectValue(additionalTypes)) {
			for (const key in additionalTypes) {
				const additionalSchemaId =
					additionalTypes[key].$id ??
					Converter.bytesToHex(
						Blake2b.sum256(Converter.utf8ToBytes(JsonHelper.canonicalize(additionalTypes[key])))
					);
				const additionalSchema = ajv.getSchema(additionalSchemaId);
				if (Is.empty(additionalSchema)) {
					ajv.addSchema(additionalTypes[key], additionalSchemaId);
				}
			}
		}

		// The lookup is routed through the cache keyed by the schema id so that a validation
		// which starts while another one is still compiling the same schema waits for that
		// compilation instead of calling getSchema itself. compileAsync adds the schema to AJV
		// before it awaits its references, so a getSchema during that window would compile the
		// partially populated schema synchronously and throw MissingRefError.
		const validateMethod = await AsyncCache.exec<AnyValidateFunction<unknown>>(
			JsonSchemaHelper.compileCacheKey(schemaId, is2019Schema, throwOnMissing),
			JsonSchemaHelper._COMPILE_CACHE_TTL_MS,
			async () => {
				const compiled = ajv.getSchema(schemaId);
				if (!Is.empty(compiled)) {
					return compiled;
				}

				try {
					return await ajv.compileAsync(schema);
				} catch (error) {
					// A failed compileAsync leaves the schema registered with its references
					// unresolved, so any later getSchema for it would throw MissingRefError rather
					// than retry the load. Remove it so the next attempt starts from scratch.
					ajv.removeSchema(schemaId);
					throw error;
				}
			},
			// Failures are cached so that the callers waiting on this compilation are given its
			// error, rather than each of them re-running the compilation concurrently.
			true
		);

		// AJV stores the errors of the most recent call on the compiled validator, which is shared
		// by every validation of the schema, so they have to be read in the same synchronous step
		// as the call. Awaiting before reading them lets another validation of the same schema
		// overwrite them, which would swap or drop the failures of this one.
		const validateResult = validateMethod(data);
		let validateErrors = validateMethod.errors;

		if (Is.promise(validateResult)) {
			// An async schema resolves with the data when it is valid and rejects with a
			// ValidationError carrying its own failures, so the shared errors are not used for it.
			validateErrors = undefined;
			await validateResult;
		}

		return JsonSchemaHelper.errorsToFailures(validateErrors);
	}

	/**
	 * Validates data with a validator compiled ahead of time from a JSON schema.
	 * @param validator The compiled validator to validate the data with.
	 * @param data The data to be validated.
	 * @returns Result containing errors if there are any.
	 */
	public static validateCompiled<T = unknown>(
		validator: ICompiledValidator,
		data: T
	): IValidationFailure[] {
		// The errors are stored on the validator, which is shared by every validation, so they
		// are read in the same synchronous step as the call.
		const isValid = validator(data);
		return isValid ? [] : JsonSchemaHelper.errorsToFailures(validator.errors);
	}

	/**
	 * Clear the compiled schemas, so the next validation compiles them again from the registered
	 * data types, e.g. after a data type has been replaced or removed. A compiled schema includes
	 * the schemas it references, so all of them are cleared rather than just the one which changed.
	 */
	public static clearCache(): void {
		for (const is2019Schema of [false, true]) {
			for (const throwOnMissing of [false, true]) {
				SharedStore.remove(JsonSchemaHelper.validatorStoreKey(is2019Schema, throwOnMissing));
			}
		}
		AsyncCache.clearCache(JsonSchemaHelper.CLASS_NAME);
	}

	/**
	 * Get the property type from a schema.
	 * @param schema The schema to extract the types from.
	 * @param propertyName The name of the property to get the type for.
	 * @returns The types of the property.
	 */
	public static getPropertyType(schema: IJsonSchema, propertyName: string): string | undefined {
		if (schema.type === "object" && Is.objectValue(schema.properties)) {
			const propertySchema = schema.properties[propertyName];
			if (Is.object<IJsonSchema>(propertySchema)) {
				if (Is.stringValue(propertySchema.$ref)) {
					return propertySchema.$ref;
				}
				return propertySchema.type as string;
			}
		}
	}

	/**
	 * Convert an entity schema to JSON schema e.g https://example.com/schemas/.
	 * @param entitySchema The entity schema to convert.
	 * @param baseDomain The base domain for local schemas e.g. https://example.com/
	 * @returns The JSON schema for the entity.
	 */
	public static entitySchemaToJsonSchema(
		entitySchema: IEntitySchema | undefined,
		baseDomain?: string
	): IJsonSchema {
		let domain = StringHelper.trimTrailingSlashes(baseDomain ?? "");
		if (domain.length > 0) {
			domain += "/";
		}

		const properties: {
			[key: string]: IJsonSchema;
		} = {};

		const required: string[] = [];

		if (Is.arrayValue(entitySchema?.properties)) {
			for (const propertySchema of entitySchema.properties) {
				const jsonPropertySchema: IJsonSchema = {
					type: propertySchema.type,
					description: propertySchema.description,
					examples: propertySchema.examples
				};

				if (Is.stringValue(propertySchema.itemType) && propertySchema.type === "array") {
					if (propertySchema.itemType === "object") {
						jsonPropertySchema.items = {
							$ref: propertySchema.itemTypeRef?.startsWith("http")
								? propertySchema.itemTypeRef
								: `${domain}${propertySchema.itemTypeRef}`
						};
					} else {
						jsonPropertySchema.items = {
							type: propertySchema.itemType
						};
					}
				} else if (propertySchema.type === "object") {
					delete jsonPropertySchema.type;
					jsonPropertySchema.$ref = propertySchema.itemTypeRef?.startsWith("http")
						? propertySchema.itemTypeRef
						: `${domain}${propertySchema.itemTypeRef}`;
				}

				properties[propertySchema.property] = jsonPropertySchema;

				if (!propertySchema.optional) {
					required.push(propertySchema.property);
				}
			}
		}

		return {
			$schema: JsonSchemaHelper.SCHEMA_VERSION,
			$id: `${domain}${entitySchema?.type}`,
			title: entitySchema?.type,
			type: entitySchema ? "object" : "null",
			description: entitySchema?.description,
			required,
			properties,
			additionalProperties: false
		};
	}

	/**
	 * Convert JSON schema errors to validation failures.
	 * @param errors The JSON schema errors to convert.
	 * @returns The validation failures.
	 * @internal
	 */
	private static errorsToFailures(
		errors: IJsonSchemaError[] | null | undefined
	): IValidationFailure[] {
		const validationFailures: IValidationFailure[] = [];

		if (Is.arrayValue(errors)) {
			for (const err of errors) {
				const { instancePath, message, keyword, schemaPath, params: errParams, ...rest } = err;
				validationFailures.push({
					property: JsonSchemaHelper.instancePathToPropertyPath(instancePath),
					reason: "validation.schemaFailed",
					properties: {
						message: message ?? "",
						keyword,
						schemaPath,
						params: errParams,
						...rest
					}
				});
			}
		}

		return validationFailures;
	}

	/**
	 * Convert an AJV instance path to a dotted property path.
	 * @param instancePath The AJV instance path.
	 * @returns The dotted property path.
	 * @internal
	 */
	private static instancePathToPropertyPath(instancePath: string | undefined): string {
		if (!Is.stringValue(instancePath) || instancePath.length === 0) {
			return "";
		}

		return instancePath
			.split("/")
			.filter(segment => segment.length > 0)
			.map(segment => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
			.join(".");
	}

	/**
	 * Build the shared store key for a validator instance.
	 * @param is2019Schema Whether the validator is for the AJV 2019 schema version.
	 * @param throwOnMissing Whether the validator throws when a reference cannot be loaded.
	 * @returns The shared store key.
	 * @internal
	 */
	private static validatorStoreKey(is2019Schema: boolean, throwOnMissing: boolean): string {
		return `${JsonSchemaHelper.CLASS_NAME}${is2019Schema ? "2019" : "2020"}${throwOnMissing ? "ThrowOnMissing" : ""}`;
	}

	/**
	 * Build the compile cache key for a schema on a validator instance.
	 * @param schemaId The id of the schema being compiled.
	 * @param is2019Schema Whether the validator is for the AJV 2019 schema version.
	 * @param throwOnMissing Whether the validator throws when a reference cannot be loaded.
	 * @returns The compile cache key.
	 * @internal
	 */
	private static compileCacheKey(
		schemaId: string,
		is2019Schema: boolean,
		throwOnMissing: boolean
	): string {
		// A compiled validator belongs to the instance it was compiled on, so the key of that
		// instance is part of the cache key.
		return `${JsonSchemaHelper.validatorStoreKey(is2019Schema, throwOnMissing)}.${schemaId}`;
	}

	/**
	 * Build an AJV validator instance with the appropriate settings and schemas.
	 * @param is2019Schema Whether to use the AJV 2019 schema version.
	 * @param throwOnMissing Whether a reference which cannot be loaded should throw instead of resolving to an empty schema.
	 * @returns An AJV validator instance ready for validation.
	 * @internal
	 */
	private static async buildValidator(
		is2019Schema = false,
		throwOnMissing = false
	): Promise<Ajv2020.Ajv2020 | Ajv2019.Ajv2019> {
		// The behaviour on a missing reference is baked into the loadSchema of the instance,
		// so each mode is cached separately.
		const storeKey = JsonSchemaHelper.validatorStoreKey(is2019Schema, throwOnMissing);

		if (is2019Schema) {
			const cache = SharedStore.get<Ajv2019.Ajv2019>(storeKey);
			if (Is.objectValue(cache)) {
				return cache;
			}
		} else {
			const cache = SharedStore.get<Ajv2020.Ajv2020>(storeKey);
			if (Is.objectValue(cache)) {
				return cache;
			}
		}

		const params = {
			...JsonSchemaHelper.validatorOptions(),
			loadSchema: JsonSchemaHelper.createLoadSchema(throwOnMissing)
		};

		let ajv;
		if (is2019Schema) {
			ajv = new Ajv2019.Ajv2019({ strict: false, ...params });
			SharedStore.set<Ajv2019.Ajv2019>(storeKey, ajv);
		} else {
			ajv = new Ajv2020.Ajv2020(params);
			SharedStore.set<Ajv2020.Ajv2020>(storeKey, ajv);
		}

		JsonSchemaHelper.configureValidator(ajv);

		return ajv;
	}

	/**
	 * The options shared by every validator instance.
	 * @returns The validator options.
	 * @internal
	 */
	private static validatorOptions(): {
		allowUnionTypes: boolean;
		allErrors: boolean;
		strictTuples: boolean;
		inlineRefs: boolean;
	} {
		return {
			allowUnionTypes: true,
			allErrors: true,
			// Disable strict tuples as it causes issues with the schema validation when
			// you have an array with fixed elements e.g. myType: [string, ...string[]]
			// https://github.com/ajv-validator/ajv/issues/1417
			strictTuples: false,
			// Validate each referenced schema with its own function rather than inlining it, which
			// matches the compiled validators generated by ts-to-schema so errors are the same.
			inlineRefs: false
		};
	}

	/**
	 * Create the method which loads a referenced schema for a validator instance.
	 * @param throwOnMissing Whether a reference which cannot be loaded should throw instead of resolving to an empty schema.
	 * @returns The method which loads a referenced schema.
	 * @internal
	 */
	private static createLoadSchema(throwOnMissing: boolean): (uri: string) => Promise<IJsonSchema> {
		return async (uri: string) => {
			const subTypeHandler = DataTypeHandlerFactory.getIfExists(uri);
			const jsonSchemaMethod = subTypeHandler?.jsonSchema?.bind(subTypeHandler);
			if (Is.function(jsonSchemaMethod)) {
				const subSchema = await jsonSchemaMethod();
				if (Is.object<IJsonSchema>(subSchema)) {
					return subSchema;
				}
			}

			try {
				await JsonSchemaHelper._loggers?.loadingSchema?.(uri);

				// We don't have the type in our local data types, so we try to fetch it from the web
				const result = await FetchHelper.fetchJson<never, IJsonSchema>(
					JsonSchemaHelper.CLASS_NAME,
					uri,
					HttpMethod.GET,
					undefined,
					{
						// Cache for an hour
						cacheTtlMs: 3600000
					}
				);
				await JsonSchemaHelper._loggers?.schemaLoaded?.(uri);
				return result;
			} catch (error) {
				await JsonSchemaHelper._loggers?.schemaLoadFailed?.(uri, BaseError.fromError(error));

				if (throwOnMissing) {
					throw new GeneralError(
						JsonSchemaHelper.CLASS_NAME,
						"schemaLoadFailed",
						{ uri },
						BaseError.fromError(error)
					);
				}

				// Failed to load remotely so return an empty object
				// so the schema validation doesn't completely fail
				return {};
			}
		};
	}

	/**
	 * Add the formats and keywords used by every validator instance.
	 * @param ajv The validator instance to configure.
	 * @internal
	 */
	private static configureValidator(ajv: Ajv2020.Ajv2020 | Ajv2019.Ajv2019): void {
		// There is an inconsistency in the types of the formats plugin,
		// so we have to cast it to unknown and then to the correct type
		const applyFormats = formatsPlugin.default as unknown as (ajvInstance: unknown) => void;
		applyFormats(ajv);

		// contentEncoding is registered by AJV as an annotation-only keyword (no validation).
		// Remove it and re-add with actual validation so base64-encoded values are verified.
		ajv.removeKeyword("contentEncoding");
		ajv.addKeyword({
			keyword: "contentEncoding",
			type: "string",
			schemaType: "string",
			/**
			 * Validate the data against the content encoding specified in the schema.
			 * @param schema The content encoding specified in the schema.
			 * @param data The data to be validated.
			 * @returns True if the data is valid for the given encoding, false otherwise.
			 */
			validate(schema: string, data: string): boolean {
				// Not currently support quoted-printable, base16, base32
				return schema !== "base64" || Is.stringBase64(data);
			},
			errors: false
		});
	}
}
