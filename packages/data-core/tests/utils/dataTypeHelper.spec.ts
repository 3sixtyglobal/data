// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Validation, type IValidationFailure } from "@twin.org/core";
import { DataTypeHandlerFactory } from "../../src/factories/dataTypeHandlerFactory.js";
import { DataTypeHelper } from "../../src/utils/dataTypeHelper.js";

describe("DataTypeHelper", () => {
	beforeAll(async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test",
			defaultValue: "",
			jsonSchema: async () => ({
				type: "string"
			}),
			validate: async (propertyName, value, failures, container) =>
				Validation.string(propertyName, value, failures)
		}));
	});

	test("Can fail to validate a string with undefined value", async () => {
		const validationFailures: IValidationFailure[] = [];

		const validation = await DataTypeHelper.validate(
			"value",
			"test",
			undefined,
			validationFailures
		);

		expect(validation).toEqual(false);
		expect(validationFailures).toEqual([
			{
				property: "value",
				reason: "validation.beText",
				properties: {
					fieldName: "validation.defaultFieldName"
				}
			}
		]);
	});

	test("Can validate a string with value", async () => {
		const validationFailures: IValidationFailure[] = [];

		const validation = await DataTypeHelper.validate("value", "test", "", validationFailures);

		expect(validation).toEqual(true);
		expect(validationFailures).toEqual([]);
	});

	test("Can validate an object that has no validate method or schema", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test"
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test", "", validationFailures);

		expect(validation).toEqual(true);
		expect(validationFailures).toEqual([]);
	});

	test("Can validate an object that has a validate method and no schema", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test",
			validate: async () => false
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test", "", validationFailures);

		expect(validation).toEqual(false);
		expect(validationFailures).toEqual([]);
	});

	test("Can validate an object that has no validate method and a schema", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test",
			jsonSchema: async () => ({
				type: "string"
			})
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test", "", validationFailures);

		expect(validation).toEqual(true);
		expect(validationFailures).toEqual([]);
	});

	test("Can fail to validate an object that has no validate method and a schema", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test",
			jsonSchema: async () => ({
				type: "string"
			})
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test", 123, validationFailures);

		expect(validation).toEqual(false);
		expect(validationFailures).toEqual([
			{
				property: "value",
				reason: "validation.schema.failedValidation",
				properties: {
					value: 123,
					schemaErrors: [
						{
							instancePath: "",
							keyword: "type",
							message: "must be string",
							params: {
								type: "string"
							},
							schemaPath: "#/type"
						}
					],
					message: "must be string"
				}
			}
		]);
	});

	test("Can validate with missing type and no option set", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test",
			jsonSchema: async () => ({
				type: "string"
			})
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test222", 123, validationFailures, {
			failOnMissingType: false
		});

		expect(validation).toEqual(true);
		expect(validationFailures).toEqual([]);
	});

	test("Can fail to validate with missing type and option set", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			context: "test",
			type: "test",
			jsonSchema: async () => ({
				type: "string"
			})
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test222", 123, validationFailures, {
			failOnMissingType: true
		});

		expect(validation).toEqual(false);
		expect(validationFailures).toEqual([
			{
				property: "value",
				reason: "validation.schema.missingType",
				properties: {
					dataType: "test222"
				}
			}
		]);
	});
});
