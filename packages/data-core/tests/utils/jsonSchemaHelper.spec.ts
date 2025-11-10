// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property, EntitySchemaHelper, SortDirection } from "@twin.org/entity";
import type { IJsonSchema } from "../../src/models/IJsonSchema.js";
import { JsonSchemaHelper } from "../../src/utils/jsonSchemaHelper.js";

/**
 * Test entity.
 */
@entity({ description: "My Test Entity" })
export class TestEntity {
	@property({
		type: "number",
		optional: true,
		isPrimary: true,
		isSecondary: true,
		sortDirection: SortDirection.Ascending,
		examples: [1, 2, 3],
		description: "My Number Property"
	})
	public prop1!: number;

	@property({
		type: "string",
		examples: ["a", "b", "c"],
		description: "My String Property"
	})
	public prop2!: string;

	@property({
		type: "array",
		itemType: "string"
	})
	public prop3!: string[];

	@property({
		type: "array",
		itemType: "object",
		itemTypeRef: "Event"
	})
	public prop4!: unknown[];

	@property({
		type: "object",
		itemTypeRef: "Book"
	})
	public prop5!: unknown;
}

describe("JsonSchemaHelper", () => {
	test("Can fail to validate a string when value is not string", async () => {
		const schema: IJsonSchema = {
			type: "string"
		};

		const data = 123;

		const validation = await JsonSchemaHelper.validate(schema, data);

		expect(validation.result).toEqual(false);
		expect(validation.error).toEqual([
			{
				instancePath: "",
				keyword: "type",
				message: "must be string",
				params: {
					type: "string"
				},
				schemaPath: "#/type"
			}
		]);
	});

	test("Can validate a string", async () => {
		const schema: IJsonSchema = {
			type: "string"
		};

		const data = "Hello World";

		const validation = await JsonSchemaHelper.validate(schema, data);

		expect(validation.result).toEqual(true);
		expect(validation.error).toBeUndefined();
	});

	test("Can fail to validate a number when value is not number", async () => {
		const schema: IJsonSchema = {
			type: "number"
		};

		const data = "123";

		const validation = await JsonSchemaHelper.validate(schema, data);

		expect(validation.result).toEqual(false);
		expect(validation.error).toEqual([
			{
				instancePath: "",
				keyword: "type",
				message: "must be number",
				params: {
					type: "number"
				},
				schemaPath: "#/type"
			}
		]);
	});

	test("Can validate a number", async () => {
		const schema: IJsonSchema = {
			type: "number"
		};

		const data = 123;

		const validation = await JsonSchemaHelper.validate(schema, data);

		expect(validation.result).toEqual(true);
		expect(validation.error).toBeUndefined();
	});

	test("Can fail to validate a property", async () => {
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				key: {
					type: "string"
				},
				type: {
					type: "string"
				},
				value: {}
			},
			required: ["key", "type", "value"]
		};

		const data = 123;

		const validation = await JsonSchemaHelper.validate(schema, data);

		expect(validation.result).toEqual(false);
		expect(validation.error).toEqual([
			{
				instancePath: "",
				keyword: "type",
				message: "must be object",
				params: {
					type: "object"
				},
				schemaPath: "#/type"
			}
		]);
	});

	test("Can validate a property", async () => {
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				key: {
					type: "string"
				},
				type: {
					type: "string"
				},
				value: {}
			},
			required: ["key", "type", "value"]
		};

		const data = {
			key: "foo",
			type: "string",
			value: "aaa"
		};

		const validation = await JsonSchemaHelper.validate(schema, data);

		expect(validation.result).toEqual(true);
		expect(validation.error).toBeUndefined();
	});

	test("Can fail to validate a property list", async () => {
		const schema: IJsonSchema = {
			type: "array",
			items: {
				$ref: "Property"
			}
		};

		const schemaProperty: IJsonSchema = {
			type: "object",
			properties: {
				key: {
					type: "string"
				},
				type: {
					type: "string"
				},
				value: {}
			},
			required: ["key", "type", "value"]
		};

		const data = 123;

		const validation = await JsonSchemaHelper.validate(schema, data, { Property: schemaProperty });

		expect(validation.result).toEqual(false);
		expect(validation.error).toEqual([
			{
				instancePath: "",
				keyword: "type",
				message: "must be array",
				params: {
					type: "array"
				},
				schemaPath: "#/type"
			}
		]);
	});

	test("Can validate a property list", async () => {
		const schema: IJsonSchema = {
			type: "array",
			items: {
				$ref: "Property"
			}
		};

		const schemaProperty: IJsonSchema = {
			type: "object",
			properties: {
				key: {
					type: "string"
				},
				type: {
					type: "string"
				},
				value: {}
			},
			required: ["key", "type", "value"]
		};

		const data = [
			{
				key: "foo",
				type: "string",
				value: "aaa"
			}
		];

		const validation = await JsonSchemaHelper.validate(schema, data, { Property: schemaProperty });

		expect(validation.result).toEqual(true);
		expect(validation.error).toBeUndefined();
	});

	test("Can fail to get the type for a property when the property does not exist", async () => {
		const type = JsonSchemaHelper.getPropertyType(
			{
				type: "object",
				properties: {
					foo: {
						type: "string"
					}
				}
			},
			"goo"
		);

		expect(type).toBeUndefined();
	});

	test("Can get the type for a property when it is a type", async () => {
		const type = JsonSchemaHelper.getPropertyType(
			{
				type: "object",
				properties: {
					foo: {
						type: "string"
					}
				}
			},
			"foo"
		);

		expect(type).toEqual("string");
	});

	test("Can get the type for a property when it is a reference", async () => {
		const type = JsonSchemaHelper.getPropertyType(
			{
				type: "object",
				properties: {
					foo: {
						$ref: "https://example.com/foo"
					}
				}
			},
			"foo"
		);

		expect(type).toEqual("https://example.com/foo");
	});

	test("Can convert an entity schema to a JSON schema", () => {
		const jsonSchema = JsonSchemaHelper.entitySchemaToJsonSchema(
			EntitySchemaHelper.getSchema(TestEntity),
			"https://example.com/"
		);

		expect(jsonSchema.$schema).toEqual(JsonSchemaHelper.SCHEMA_VERSION);
		expect(jsonSchema.$id).toEqual("https://example.com/TestEntity");
		expect(jsonSchema.title).toEqual("TestEntity");
		expect(jsonSchema.type).toEqual("object");
		expect(jsonSchema.description).toEqual("My Test Entity");
		expect(jsonSchema.required).toEqual(["prop2", "prop3", "prop4", "prop5"]);
		expect(jsonSchema.properties?.prop1).toEqual({
			type: "number",
			description: "My Number Property",
			examples: [1, 2, 3]
		});
		expect(jsonSchema.properties?.prop2).toEqual({
			type: "string",
			description: "My String Property",
			examples: ["a", "b", "c"]
		});
		expect(jsonSchema.properties?.prop3).toEqual({
			type: "array",
			items: {
				type: "string"
			}
		});
		expect(jsonSchema.properties?.prop4).toEqual({
			type: "array",
			items: {
				$ref: "https://example.com/Event"
			}
		});
		expect(jsonSchema.properties?.prop5).toEqual({
			$ref: "https://example.com/Book"
		});
		expect(jsonSchema.additionalProperties).toEqual(false);
	});

	test("Can convert an entity schema to a JSON schema with no base domain", () => {
		const jsonSchema = JsonSchemaHelper.entitySchemaToJsonSchema(
			EntitySchemaHelper.getSchema(TestEntity)
		);

		expect(jsonSchema.$schema).toEqual(JsonSchemaHelper.SCHEMA_VERSION);
		expect(jsonSchema.$id).toEqual("TestEntity");
		expect(jsonSchema.title).toEqual("TestEntity");
		expect(jsonSchema.type).toEqual("object");
		expect(jsonSchema.description).toEqual("My Test Entity");
		expect(jsonSchema.required).toEqual(["prop2", "prop3", "prop4", "prop5"]);
		expect(jsonSchema.properties?.prop1).toEqual({
			type: "number",
			description: "My Number Property",
			examples: [1, 2, 3]
		});
		expect(jsonSchema.properties?.prop2).toEqual({
			type: "string",
			description: "My String Property",
			examples: ["a", "b", "c"]
		});
		expect(jsonSchema.properties?.prop3).toEqual({
			type: "array",
			items: {
				type: "string"
			}
		});
		expect(jsonSchema.properties?.prop4).toEqual({
			type: "array",
			items: {
				$ref: "Event"
			}
		});
		expect(jsonSchema.properties?.prop5).toEqual({
			$ref: "Book"
		});
		expect(jsonSchema.additionalProperties).toEqual(false);
	});

	it("should be able to validate context variants", async () => {
		const testCases = [
			{
				data: "https://www.w3.org/ns/odrl/2/",
				expect: true
			},
			{
				data: "https://foo",
				expect: false
			},
			{
				data: ["https://www.w3.org/ns/odrl/2/"],
				expect: false
			},
			{
				data: ["https://foo"],
				expect: false
			},
			{
				data: ["https://www.w3.org/ns/odrl/2/", "https://www.w3.org/ns/odrl/2/"],
				expect: false
			},
			{
				data: ["https://foo", "https://foo"],
				expect: false
			},
			{
				data: ["https://foo", "https://foo2"],
				expect: false
			},
			{
				data: ["https://foo", "https://www.w3.org/ns/odrl/2/"],
				expect: true
			},
			{
				data: ["https://foo", "https://foo", "https://www.w3.org/ns/odrl/2/"],
				expect: false
			},
			{
				data: ["https://foo", "https://www.w3.org/ns/odrl/2/", "https://foo"],
				expect: false
			},
			{
				data: ["https://foo", "https://www.w3.org/ns/odrl/2/", "https://foo2"],
				expect: true
			}
		];

		const schema: IJsonSchema = {
			type: "object",
			properties: {
				"@context": {
					anyOf: [
						{
							type: "string",
							const: "https://www.w3.org/ns/odrl/2/"
						},
						{
							type: "array",
							minItems: 2,
							items: {
								$ref: "https://schema.twindev.org/json-ld/JsonLdContextDefinitionElement"
							},
							minContains: 1,
							maxContains: 1,
							contains: {
								const: "https://www.w3.org/ns/odrl/2/"
							},
							uniqueItems: true
						}
					]
				}
			}
		};

		for (const testCase of testCases) {
			const result = await JsonSchemaHelper.validate(schema, { "@context": testCase.data });
			expect(result.result).toBe(testCase.expect);
		}
	});
});
