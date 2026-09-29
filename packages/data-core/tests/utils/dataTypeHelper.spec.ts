// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Validation, type IValidationFailure } from "@twin.org/core";
import Ajv2020 from "ajv/dist/2020.js";
import { DataTypeHandlerFactory } from "../../src/factories/dataTypeHandlerFactory.js";
import type { IJsonSchema } from "../../src/models/IJsonSchema.js";
import { DataTypeHelper } from "../../src/utils/dataTypeHelper.js";
import { JsonSchemaHelper } from "../../src/utils/jsonSchemaHelper.js";

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

	test("Can leave an already registered type unchanged when registering it again", async () => {
		const namespace = "https://test.register.example/";
		const first = { type: "string" as const };
		DataTypeHelper.registerType(namespace, "twice", undefined, first);
		DataTypeHelper.registerType(namespace, "twice", undefined, { type: "number" as const });

		expect(await DataTypeHandlerFactory.get(`${namespace}twice`).jsonSchema?.()).toEqual(first);
	});

	test("Can replace an already registered type when registering it with force", async () => {
		const namespace = "https://test.register.example/";
		const replacement = { type: "number" as const };
		DataTypeHelper.registerType(namespace, "forced", undefined, { type: "string" as const });
		DataTypeHelper.registerType(namespace, "forced", undefined, replacement, undefined, {
			force: true
		});

		expect(await DataTypeHandlerFactory.get(`${namespace}forced`).jsonSchema?.()).toEqual(
			replacement
		);
	});

	test("Can replace already registered types when registering a list with force", async () => {
		const namespace = "https://test.register.example/";
		const replacement = { type: "boolean" as const };
		DataTypeHelper.registerTypes(namespace, undefined, [
			{ type: "forcedList", schema: { type: "string" as const } }
		]);
		DataTypeHelper.registerTypes(
			namespace,
			undefined,
			[{ type: "forcedList", schema: replacement }],
			{
				force: true
			}
		);

		expect(await DataTypeHandlerFactory.get(`${namespace}forcedList`).jsonSchema?.()).toEqual(
			replacement
		);
	});

	test("Can unregister a type so it can be registered again", async () => {
		const namespace = "https://test.register.example/";
		const replacement = { type: "integer" as const };
		DataTypeHelper.registerType(namespace, "removed", undefined, { type: "string" as const });
		DataTypeHelper.unregisterType(namespace, "removed");

		expect(DataTypeHandlerFactory.hasName(`${namespace}removed`)).toEqual(false);

		DataTypeHelper.registerType(namespace, "removed", undefined, replacement);

		expect(await DataTypeHandlerFactory.get(`${namespace}removed`).jsonSchema?.()).toEqual(
			replacement
		);
	});

	test("Can validate with the replacement schema after a compiled type is replaced with force", async () => {
		const namespace = "https://test.recompile.example/";
		const id = `${namespace}replaced`;
		DataTypeHelper.registerType(namespace, "replaced", undefined, { $id: id, type: "string" });

		const before: IValidationFailure[] = [];
		expect(await DataTypeHelper.validate("value", id, "text", before)).toEqual(true);

		DataTypeHelper.registerType(
			namespace,
			"replaced",
			undefined,
			{ $id: id, type: "number" },
			undefined,
			{ force: true }
		);

		const after: IValidationFailure[] = [];
		expect(await DataTypeHelper.validate("value", id, "text", after)).toEqual(false);
		expect(after.length).toBeGreaterThan(0);
	});

	test("Can validate with the new schema after a compiled type is unregistered and registered again", async () => {
		const namespace = "https://test.recompile.example/";
		const id = `${namespace}reregistered`;
		DataTypeHelper.registerType(namespace, "reregistered", undefined, { $id: id, type: "string" });

		const before: IValidationFailure[] = [];
		expect(await DataTypeHelper.validate("value", id, "text", before)).toEqual(true);

		DataTypeHelper.unregisterType(namespace, "reregistered");
		DataTypeHelper.registerType(namespace, "reregistered", undefined, { $id: id, type: "boolean" });

		const after: IValidationFailure[] = [];
		expect(await DataTypeHelper.validate("value", id, "text", after)).toEqual(false);
	});

	describe("compiledValidator", () => {
		const namespace = "https://test.compiled.example/";
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				value: { type: "number" }
			},
			required: ["value"]
		};

		afterEach(() => {
			vi.restoreAllMocks();
		});

		test("Can validate with the compiled validator instead of the JSON schema", async () => {
			DataTypeHelper.registerType(
				namespace,
				"preferred",
				undefined,
				schema,
				new Ajv2020.Ajv2020().compile(schema)
			);
			const validateSpy = vi.spyOn(JsonSchemaHelper, "validate");

			const validationFailures: IValidationFailure[] = [];
			const validation = await DataTypeHelper.validate(
				"item",
				`${namespace}preferred`,
				{ value: "bad" },
				validationFailures
			);

			expect(validation).toEqual(false);
			expect(validationFailures).toEqual([
				{
					property: "item.value",
					reason: "validation.schemaFailed",
					properties: {
						keyword: "type",
						message: "must be number",
						params: {
							type: "number"
						},
						schemaPath: "#/properties/value/type"
					}
				}
			]);
			expect(validateSpy).not.toHaveBeenCalled();
		});

		test("Can pass valid data with the compiled validator", async () => {
			DataTypeHelper.registerType(
				namespace,
				"valid",
				undefined,
				schema,
				new Ajv2020.Ajv2020().compile(schema)
			);

			const validationFailures: IValidationFailure[] = [];
			const validation = await DataTypeHelper.validate(
				"item",
				`${namespace}valid`,
				{ value: 1 },
				validationFailures
			);

			expect(validation).toEqual(true);
			expect(validationFailures).toEqual([]);
		});

		test("Can fall back to the JSON schema when no compiled validator is registered", async () => {
			DataTypeHelper.registerType(namespace, "fallback", undefined, schema);
			const validateSpy = vi.spyOn(JsonSchemaHelper, "validate");

			const handler = DataTypeHandlerFactory.get(`${namespace}fallback`);
			const validationFailures: IValidationFailure[] = [];
			const validation = await DataTypeHelper.validate(
				"item",
				`${namespace}fallback`,
				{ value: "bad" },
				validationFailures
			);

			expect(handler.compiledValidator).toBeUndefined();
			expect(validation).toEqual(false);
			expect(validationFailures).toHaveLength(1);
			expect(validateSpy).toHaveBeenCalledTimes(1);
		});

		test("Can register compiled validators with registerTypes", async () => {
			const compiled = new Ajv2020.Ajv2020().compile(schema);
			DataTypeHelper.registerTypes(namespace, undefined, [
				{ type: "listed", schema, compiledValidator: Promise.resolve(compiled) }
			]);

			const handler = DataTypeHandlerFactory.get(`${namespace}listed`);

			expect(await handler.compiledValidator?.()).toBe(compiled);
		});

		test("Can validate with a compiled validator when the handler has no JSON schema", async () => {
			DataTypeHandlerFactory.register(`${namespace}only-compiled`, () => ({
				namespace,
				type: "only-compiled",
				compiledValidator: async () => new Ajv2020.Ajv2020().compile(schema)
			}));

			const validationFailures: IValidationFailure[] = [];
			const validation = await DataTypeHelper.validate(
				"item",
				`${namespace}only-compiled`,
				{},
				validationFailures
			);

			expect(validation).toEqual(false);
			expect(validationFailures).toHaveLength(1);
			expect(validationFailures[0].properties?.keyword).toEqual("required");
		});

		test("Can get the compiled validator for a type", async () => {
			const compiled = new Ajv2020.Ajv2020().compile(schema);
			DataTypeHelper.registerType(namespace, "get-validator", undefined, schema, compiled);

			expect(await DataTypeHelper.getCompiledValidatorForType(`${namespace}get-validator`)).toBe(
				compiled
			);
		});

		test("Can get undefined for the compiled validator of a type without one", async () => {
			DataTypeHelper.registerType(namespace, "get-validator-none", undefined, schema);

			expect(
				await DataTypeHelper.getCompiledValidatorForType(`${namespace}get-validator-none`)
			).toBeUndefined();
		});

		test("Can get undefined for the compiled validator of a missing type", async () => {
			expect(
				await DataTypeHelper.getCompiledValidatorForType(`${namespace}get-validator-missing`)
			).toBeUndefined();
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
