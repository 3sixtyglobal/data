// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, type IValidationFailure } from "@3sixty/core";
import { JsonSchemaHelper } from "./jsonSchemaHelper.js";
import { DataTypeHandlerFactory } from "../factories/dataTypeHandlerFactory.js";
import type { ICompiledValidator } from "../models/ICompiledValidator.js";
import type { IJsonSchema } from "../models/IJsonSchema.js";
import { ValidationMode } from "../models/validationMode.js";

/**
 * Class to help with data types.
 */
export class DataTypeHelper {
	/**
	 * Register a data type, a type which is already registered is left unchanged so registering
	 * dependent types more than once has no effect, unless the force option is set.
	 * @param namespace The namespace for the type.
	 * @param type The type for the item.
	 * @param jsonLdContext The JSON LD context for the type.
	 * @param schema The JSON schema for the type.
	 * @param compiledValidator Optional validator compiled from the JSON schema, used in place of compiling the schema at runtime.
	 * @param options Options for the registration.
	 * @param options.force Replace the type if it is already registered, defaults to false.
	 */
	public static registerType(
		namespace: string,
		type: string,
		jsonLdContext: string | undefined,
		schema: IJsonSchema | Promise<IJsonSchema>,
		compiledValidator?: ICompiledValidator | Promise<ICompiledValidator>,
		options?: {
			force?: boolean;
		}
	): void {
		const name = `${namespace}${type}`;
		if (DataTypeHandlerFactory.hasName(name)) {
			if (!(options?.force ?? false)) {
				return;
			}
			// The replaced type may already be compiled into the cached schemas.
			JsonSchemaHelper.clearCache();
		}
		DataTypeHandlerFactory.register(name, () => ({
			namespace,
			jsonLdContext,
			type,
			jsonSchema: async () => schema,
			compiledValidator: Is.empty(compiledValidator) ? undefined : async () => compiledValidator
		}));
	}

	/**
	 * Register a list of types, types which are already registered are left unchanged unless the
	 * force option is set.
	 * @param namespace The namespace for the types.
	 * @param jsonLdContext The JSON LD context for the types.
	 * @param typeDefinition The type definitions to register.
	 * @param options Options for the registration.
	 * @param options.force Replace the types which are already registered, defaults to false.
	 */
	public static registerTypes(
		namespace: string,
		jsonLdContext: string | undefined,
		typeDefinition: {
			type: string;
			schema: IJsonSchema | Promise<IJsonSchema>;
			compiledValidator?: ICompiledValidator | Promise<ICompiledValidator>;
		}[],
		options?: {
			force?: boolean;
		}
	): void {
		for (const typeDef of typeDefinition) {
			DataTypeHelper.registerType(
				namespace,
				typeDef.type,
				jsonLdContext,
				typeDef.schema,
				typeDef.compiledValidator,
				options
			);
		}
	}

	/**
	 * Unregister a data type, so it can be registered again with a different definition.
	 * @param namespace The namespace for the type.
	 * @param type The type for the item.
	 */
	public static unregisterType(namespace: string, type: string): void {
		const name = `${namespace}${type}`;
		if (DataTypeHandlerFactory.hasName(name)) {
			DataTypeHandlerFactory.unregister(name);
			// The removed type may already be compiled into the cached schemas.
			JsonSchemaHelper.clearCache();
		}
	}

	/**
	 * Get the JSON schema for a data type.
	 * @param dataType The data type to get the schema for.
	 * @returns The JSON schema for the data type or undefined if not found.
	 */
	public static async getSchemaForType(dataType: string): Promise<IJsonSchema | undefined> {
		const handler = DataTypeHandlerFactory.getIfExists(dataType);
		return handler?.jsonSchema ? handler.jsonSchema() : undefined;
	}

	/**
	 * Get the compiled validator for a data type.
	 * @param dataType The data type to get the compiled validator for.
	 * @returns The compiled validator for the data type or undefined if not found.
	 */
	public static async getCompiledValidatorForType(
		dataType: string
	): Promise<ICompiledValidator | undefined> {
		const handler = DataTypeHandlerFactory.getIfExists(dataType);
		return handler?.compiledValidator ? handler.compiledValidator() : undefined;
	}

	/**
	 * Validate a data type.
	 * @param propertyName The name of the property being validated to use in error messages.
	 * @param dataType The data type to validate.
	 * @param data The data to validate.
	 * @param validationFailures The list of validation failures to add to.
	 * @param options Optional options for validation.
	 * @param options.failOnMissingType If true, will fail validation if the data type is missing, defaults to false.
	 * @param options.validationMode The validation mode to use, defaults to either.
	 * @returns True if the data was valid.
	 */
	public static async validate(
		propertyName: string,
		dataType: string | undefined,
		data: unknown,
		validationFailures: IValidationFailure[],
		options?: {
			validationMode?: ValidationMode;
			failOnMissingType?: boolean;
		}
	): Promise<boolean> {
		let isValid = true;

		if (Is.stringValue(dataType)) {
			const handler = DataTypeHandlerFactory.getIfExists(dataType);

			if (handler) {
				const validationMode = options?.validationMode ?? ValidationMode.Either;

				// If we have a validate function use that as it is more specific
				// and will produce better error messages
				let hasValidated = false;
				const validateMethod = handler.validate?.bind(handler);
				if (
					(validationMode === ValidationMode.Validate ||
						validationMode === ValidationMode.Both ||
						validationMode === ValidationMode.Either) &&
					Is.function(validateMethod)
				) {
					isValid = await validateMethod(propertyName, data, validationFailures);
					hasValidated = true;
				}

				const compiledValidatorMethod = handler.compiledValidator?.bind(handler);
				const jsonSchemaMethod = handler.jsonSchema?.bind(handler);
				if (
					(validationMode === ValidationMode.JsonSchema ||
						(validationMode === ValidationMode.Either && !hasValidated) ||
						validationMode === ValidationMode.Both) &&
					(Is.function(compiledValidatorMethod) || Is.function(jsonSchemaMethod))
				) {
					// Otherwise use the JSON schema if there is one, preferring its compiled validator
					let failures: IValidationFailure[] = [];
					const compiledValidator = await compiledValidatorMethod?.();

					if (Is.function(compiledValidator)) {
						failures = JsonSchemaHelper.validateCompiled(compiledValidator, data);
					} else {
						const schema = await jsonSchemaMethod?.();
						if (Is.object<IJsonSchema>(schema)) {
							failures = await JsonSchemaHelper.validate(schema, data);
						}
					}

					if (failures.length > 0) {
						validationFailures.push(
							...failures.map(f => ({
								...f,
								property: f.property.length > 0 ? `${propertyName}.${f.property}` : propertyName
							}))
						);
						isValid = false;
					}
				}
			} else if (options?.failOnMissingType ?? false) {
				// If we don't have a handler for a specific type and we are failing on missing type
				validationFailures.push({
					property: propertyName,
					reason: "validation.schema.missingType",
					properties: {
						dataType
					}
				});
				isValid = false;
			}
		}

		return isValid;
	}
}
