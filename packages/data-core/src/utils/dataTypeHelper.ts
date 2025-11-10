// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, type IValidationFailure } from "@twin.org/core";
import { JsonSchemaHelper } from "./jsonSchemaHelper.js";
import { DataTypeHandlerFactory } from "../factories/dataTypeHandlerFactory.js";
import type { IJsonSchema } from "../models/IJsonSchema.js";
import { ValidationMode } from "../models/validationMode.js";

/**
 * Class to help with data types.
 */
export class DataTypeHelper {
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

				const jsonSchemaMethod = handler.jsonSchema?.bind(handler);
				if (
					(validationMode === ValidationMode.JsonSchema ||
						(validationMode === ValidationMode.Either && !hasValidated) ||
						validationMode === ValidationMode.Both) &&
					Is.function(jsonSchemaMethod)
				) {
					// Otherwise use the JSON schema if there is one
					const schema = await jsonSchemaMethod();

					if (Is.object<IJsonSchema>(schema)) {
						const validationResult = await JsonSchemaHelper.validate(schema, data);
						if (Is.arrayValue(validationResult.error)) {
							validationFailures.push({
								property: propertyName,
								reason: "validation.schema.failedValidation",
								properties: {
									value: data,
									schemaErrors: validationResult.error,
									message: validationResult.error.map(e => e.message).join("\n")
								}
							});
						}
						if (!validationResult.result) {
							isValid = false;
						}
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
