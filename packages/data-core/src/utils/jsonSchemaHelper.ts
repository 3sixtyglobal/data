// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AsyncCache,
	BaseError,
	Converter,
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
import formatsPlugin from "ajv-formats";
import { DataTypeHandlerFactory } from "../factories/dataTypeHandlerFactory.js";
import type { IJsonSchema } from "../models/IJsonSchema.js";

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
	 * @returns Result containing errors if there are any.
	 */
	public static async validate<T = unknown>(
		schema: IJsonSchema,
		data: T,
		additionalTypes?: { [id: string]: IJsonSchema }
	): Promise<IValidationFailure[]> {
		let schemaId = schema.$id;

		if (!Is.stringValue(schemaId)) {
			schemaId = Converter.bytesToHex(
				Blake2b.sum256(Converter.utf8ToBytes(JsonHelper.canonicalize(schema)))
			);
		}

		const is2019Schema = schema.$schema === JsonSchemaHelper.SCHEMA_VERSION_2019;

		const ajv = await JsonSchemaHelper.buildValidator(additionalTypes, is2019Schema);

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

		let validateMethod = ajv.getSchema(schemaId);
		if (Is.empty(validateMethod)) {
			validateMethod = await AsyncCache.exec(
				`${schemaId}.${is2019Schema ? "2019" : "2020"}`,
				JsonSchemaHelper._COMPILE_CACHE_TTL_MS,
				async () => ajv.compileAsync(schema)
			);
		}

		await validateMethod(data);

		const validationFailures: IValidationFailure[] = [];

		if (Is.arrayValue(validateMethod.errors)) {
			for (const err of validateMethod.errors) {
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
			description: entitySchema?.options?.description,
			required,
			properties,
			additionalProperties: false
		};
	}

	/**
	 * Convert an AJV instance path to a dotted property path.
	 * @param instancePath The AJV instance path.
	 * @returns The dotted property path.
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
	 * Build an AJV validator instance with the appropriate settings and schemas.
	 * @param params The parameters for building the validator, including options and the loadSchema function.
	 * @param schema The root schema to be used for validation, used to determine the AJV version.
	 * @param additionalTypes Additional types to add for reference, not already in DataTypeHandlerFactory.
	 * @returns An AJV validator instance ready for validation.
	 * @internal
	 */
	private static async buildValidator(
		additionalTypes?: { [id: string]: IJsonSchema },
		is2019Schema = false
	): Promise<Ajv2020.Ajv2020 | Ajv2019.Ajv2019> {
		if (is2019Schema) {
			const cache = SharedStore.get<Ajv2019.Ajv2019>(`${JsonSchemaHelper.CLASS_NAME}2019`);
			if (Is.objectValue(cache)) {
				return cache;
			}
		} else {
			const cache = SharedStore.get<Ajv2020.Ajv2020>(`${JsonSchemaHelper.CLASS_NAME}2020`);
			if (Is.objectValue(cache)) {
				return cache;
			}
		}

		const params = {
			allowUnionTypes: true,
			allErrors: true,
			// Disable strict tuples as it causes issues with the schema validation when
			// you have an array with fixed elements e.g. myType: [string, ...string[]]
			// https://github.com/ajv-validator/ajv/issues/1417
			strictTuples: false,
			loadSchema: async (uri: string) => {
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
					// Failed to load remotely so return an empty object
					// so the schema validation doesn't completely fail
					return {};
				}
			}
		};

		let ajv;
		if (is2019Schema) {
			ajv = new Ajv2019.Ajv2019({ strict: false, ...params });
			SharedStore.set<Ajv2019.Ajv2019>(`${JsonSchemaHelper.CLASS_NAME}2019`, ajv);
		} else {
			ajv = new Ajv2020.Ajv2020(params);
			SharedStore.set<Ajv2020.Ajv2020>(`${JsonSchemaHelper.CLASS_NAME}2020`, ajv);
		}

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
			 * @returns True if the data is valid according to the content encoding, false otherwise.
			 * Currently only supports base64 encoding, other encodings will be treated as valid without additional checks.
			 * This is because AJV's formats plugin does not support all content encodings and we want to allow for custom encodings as well.
			 */
			validate(schema: string, data: string): boolean {
				// Not currently support quoted-printable, base16, base32
				return schema !== "base64" || Is.stringBase64(data);
			},
			errors: false
		});

		return ajv;
	}
}
