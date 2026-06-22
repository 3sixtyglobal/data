// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Validation, type IValidationFailure } from "@twin.org/core";
import { DataTypeHandlerFactory } from "../../src/factories/dataTypeHandlerFactory.js";
import { DataTypeHelper } from "../../src/utils/dataTypeHelper.js";

describe("DataTypeHelper", () => {
	beforeAll(async () => {
		DataTypeHandlerFactory.register("test", () => ({
			namespace: "test",
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
			namespace: "test",
			type: "test"
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test", "", validationFailures);

		expect(validation).toEqual(true);
		expect(validationFailures).toEqual([]);
	});

	test("Can validate an object that has a validate method and no schema", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			namespace: "test",
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
			namespace: "test",
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
			namespace: "test",
			type: "test",
			jsonSchema: async () => ({
				type: "string"
			})
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate("value", "test", 123, validationFailures);

		expect(validation).toEqual(false);
		expect(validationFailures).toHaveLength(1);
		expect(validationFailures[0]).toEqual({
			property: "value",
			reason: "validation.schemaFailed",
			properties: {
				keyword: "type",
				message: "must be string",
				params: {
					type: "string"
				},
				schemaPath: "#/type"
			}
		});
	});

	test("Can include nested property path for complex object schema failures", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			namespace: "test",
			type: "test",
			jsonSchema: async () => ({
				type: "object",
				properties: {
					profile: {
						type: "object",
						properties: {
							addresses: {
								type: "array",
								items: {
									type: "object",
									properties: {
										postalCode: {
											type: "string",
											pattern: "^[A-Z]{2}[0-9]{2}$"
										}
									},
									required: ["postalCode"]
								}
							}
						},
						required: ["addresses"]
					}
				},
				required: ["profile"]
			})
		}));
		const validationFailures: IValidationFailure[] = [];
		const validation = await DataTypeHelper.validate(
			"value",
			"test",
			{
				profile: {
					addresses: [
						{
							postalCode: "bad"
						}
					]
				}
			},
			validationFailures
		);

		expect(validation).toEqual(false);
		expect(validationFailures).toHaveLength(1);
		expect(validationFailures[0]).toEqual({
			property: "value.profile.addresses.0.postalCode",
			reason: "validation.schemaFailed",
			properties: {
				keyword: "pattern",
				message: 'must match pattern "^[A-Z]{2}[0-9]{2}$"',
				params: {
					pattern: "^[A-Z]{2}[0-9]{2}$"
				},
				schemaPath: "#/properties/profile/properties/addresses/items/properties/postalCode/pattern"
			}
		});
	});

	test("Can validate with missing type and no option set", async () => {
		DataTypeHandlerFactory.register("test", () => ({
			namespace: "test",
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
			namespace: "test",
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
