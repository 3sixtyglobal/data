// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { AsyncCache, SharedStore } from "@twin.org/core";
import { entity, property, EntitySchemaHelper, SortDirection } from "@twin.org/entity";
import { FetchHelper } from "@twin.org/web";
import { afterEach, describe, expect, test, vi } from "vitest";
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

		const failures = await JsonSchemaHelper.validate(schema, data);

		expect(failures).toHaveLength(1);
		expect(failures[0]).toEqual({
			property: "",
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

	test("Can validate a string", async () => {
		const schema: IJsonSchema = {
			type: "string"
		};

		const data = "Hello World";

		const failures = await JsonSchemaHelper.validate(schema, data);

		expect(failures).toHaveLength(0);
	});

	test("Can fail to validate a number when value is not number", async () => {
		const schema: IJsonSchema = {
			type: "number"
		};

		const data = "123";

		const failures = await JsonSchemaHelper.validate(schema, data);

		expect(failures).toHaveLength(1);
		expect(failures[0]).toEqual({
			property: "",
			reason: "validation.schemaFailed",
			properties: {
				keyword: "type",
				message: "must be number",
				params: {
					type: "number"
				},
				schemaPath: "#/type"
			}
		});
	});

	test("Can validate a number", async () => {
		const schema: IJsonSchema = {
			type: "number"
		};

		const data = 123;

		const failures = await JsonSchemaHelper.validate(schema, data);

		expect(failures).toHaveLength(0);
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

		const failures = await JsonSchemaHelper.validate(schema, data);

		expect(failures).toHaveLength(1);
		expect(failures[0]).toEqual({
			property: "",
			reason: "validation.schemaFailed",
			properties: {
				keyword: "type",
				message: "must be object",
				params: {
					type: "object"
				},
				schemaPath: "#/type"
			}
		});
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

		const failures = await JsonSchemaHelper.validate(schema, data);

		expect(failures).toHaveLength(0);
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

		const failures = await JsonSchemaHelper.validate(schema, data, { Property: schemaProperty });

		expect(failures).toHaveLength(1);
		expect(failures[0]).toEqual({
			property: "",
			reason: "validation.schemaFailed",
			properties: {
				keyword: "type",
				message: "must be array",
				params: {
					type: "array"
				},
				schemaPath: "#/type"
			}
		});
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

		const failures = await JsonSchemaHelper.validate(schema, data, { Property: schemaProperty });

		expect(failures).toHaveLength(0);
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
			const failures = await JsonSchemaHelper.validate(schema, { "@context": testCase.data });
			if (testCase.expect) {
				expect(failures).toHaveLength(0);
			} else {
				expect(failures.length).toBeGreaterThan(0);
			}
		}
	});

	test("Can validate string with minLength constraint", async () => {
		const schema: IJsonSchema = {
			type: "string",
			minLength: 5
		};

		const failures = await JsonSchemaHelper.validate(schema, "abc");

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("minLength");
		expect(
			(
				(failures[0]?.properties as { [key: string]: unknown })?.params as {
					[key: string]: unknown;
				}
			)?.limit
		).toBe(5);
	});

	test("Can validate string with maxLength constraint", async () => {
		const schema: IJsonSchema = {
			type: "string",
			maxLength: 3
		};

		const failures = await JsonSchemaHelper.validate(schema, "abcdefgh");

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("maxLength");
		expect(
			(
				(failures[0]?.properties as { [key: string]: unknown })?.params as {
					[key: string]: unknown;
				}
			)?.limit
		).toBe(3);
	});

	test("Can validate string with pattern constraint", async () => {
		const schema: IJsonSchema = {
			type: "string",
			pattern: "^[A-Z]{3}$"
		};

		const failures = await JsonSchemaHelper.validate(schema, "abc");

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("pattern");
	});

	test("Can validate number with minimum constraint", async () => {
		const schema: IJsonSchema = {
			type: "number",
			minimum: 10
		};

		const failures = await JsonSchemaHelper.validate(schema, 5);

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("minimum");
		expect(
			(
				(failures[0]?.properties as { [key: string]: unknown })?.params as {
					[key: string]: unknown;
				}
			)?.limit
		).toBe(10);
	});

	test("Can validate number with maximum constraint", async () => {
		const schema: IJsonSchema = {
			type: "number",
			maximum: 10
		};

		const failures = await JsonSchemaHelper.validate(schema, 15);

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("maximum");
		expect(
			(
				(failures[0]?.properties as { [key: string]: unknown })?.params as {
					[key: string]: unknown;
				}
			)?.limit
		).toBe(10);
	});

	test("Can validate array with minItems constraint", async () => {
		const schema: IJsonSchema = {
			type: "array",
			items: { type: "string" },
			minItems: 2
		};

		const failures = await JsonSchemaHelper.validate(schema, ["only-one"]);

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("minItems");
		expect(
			(
				(failures[0]?.properties as { [key: string]: unknown })?.params as {
					[key: string]: unknown;
				}
			)?.limit
		).toBe(2);
	});

	test("Can validate array with maxItems constraint", async () => {
		const schema: IJsonSchema = {
			type: "array",
			items: { type: "string" },
			maxItems: 2
		};

		const failures = await JsonSchemaHelper.validate(schema, ["a", "b", "c"]);

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("maxItems");
		expect(
			(
				(failures[0]?.properties as { [key: string]: unknown })?.params as {
					[key: string]: unknown;
				}
			)?.limit
		).toBe(2);
	});

	test("Can validate array with uniqueItems constraint", async () => {
		const schema: IJsonSchema = {
			type: "array",
			items: { type: "string" },
			uniqueItems: true
		};

		const failures = await JsonSchemaHelper.validate(schema, ["a", "b", "a"]);

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("uniqueItems");
	});

	test("Can validate enum constraint", async () => {
		const schema: IJsonSchema = {
			type: "string",
			enum: ["red", "green", "blue"]
		};

		const failures = await JsonSchemaHelper.validate(schema, "yellow");

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("enum");
	});

	test("Can capture multiple validation errors with allErrors enabled", async () => {
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				name: { type: "string", minLength: 3 },
				age: { type: "number", minimum: 0 }
			},
			required: ["name", "age"]
		};

		const failures = await JsonSchemaHelper.validate(schema, {
			name: "ab",
			age: -5
		});

		expect(failures.length).toBeGreaterThanOrEqual(2);
		const keywords = failures.map(f => (f.properties as { [key: string]: unknown })?.keyword);
		expect(keywords).toContain("minLength");
		expect(keywords).toContain("minimum");
	});

	test("Can handle nested object validation", async () => {
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				user: {
					type: "object",
					properties: {
						email: { type: "string", pattern: "^\\S+@\\S+$" }
					},
					required: ["email"]
				}
			},
			required: ["user"]
		};

		const failures = await JsonSchemaHelper.validate(schema, {
			user: {
				email: "invalid-email"
			}
		});

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("user.email");
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("pattern");
	});

	test("Can format root object property paths without double dots", async () => {
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				contactEmail: {
					type: "string",
					pattern: "^\\S+@\\S+$"
				}
			},
			required: ["contactEmail"]
		};

		const failures = await JsonSchemaHelper.validate(schema, {
			contactEmail: "invalid-email"
		});

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("contactEmail");
		expect(failures[0]?.property.includes("..")).toBe(false);
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("pattern");
	});

	test("Can format complex object property paths without double dots", async () => {
		const schema: IJsonSchema = {
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
		};

		const failures = await JsonSchemaHelper.validate(schema, {
			profile: {
				addresses: [
					{
						postalCode: "bad"
					}
				]
			}
		});

		expect(failures).toHaveLength(1);
		expect(failures[0]?.property).toBe("profile.addresses.0.postalCode");
		expect(failures[0]?.property.includes("..")).toBe(false);
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe("pattern");
	});

	test("Can validate with additionalProperties false", async () => {
		const schema: IJsonSchema = {
			type: "object",
			properties: {
				name: { type: "string" }
			},
			additionalProperties: false
		};

		const failures = await JsonSchemaHelper.validate(schema, {
			name: "John",
			extra: "field"
		});

		expect(failures).toHaveLength(1);
		expect(failures[0]?.reason).toBe("validation.schemaFailed");
		expect((failures[0]?.properties as { [key: string]: unknown })?.keyword).toBe(
			"additionalProperties"
		);
	});

	test("Can cache validator instances for 2020 schemas", async () => {
		const cache = new Map<string, unknown>();
		const getSpy = vi.spyOn(SharedStore, "get");
		const setSpy = vi.spyOn(SharedStore, "set");

		getSpy.mockImplementation((key: string) => cache.get(key));
		setSpy.mockImplementation((key: string, value: unknown) => {
			cache.set(key, value);
		});

		const schema: IJsonSchema = {
			type: "string"
		};

		const failures1 = await JsonSchemaHelper.validate(schema, "first-value");
		const failures2 = await JsonSchemaHelper.validate(schema, "second-value");

		expect(failures1).toHaveLength(0);
		expect(failures2).toHaveLength(0);
		expect(cache.has(`${JsonSchemaHelper.CLASS_NAME}2020`)).toBe(true);
		expect(cache.has("asyncCache")).toBe(true);
		expect(setSpy).toHaveBeenCalledTimes(2);

		vi.restoreAllMocks();
	});

	test("Can cache validator instances for 2019 schemas", async () => {
		const cache = new Map<string, unknown>();
		const getSpy = vi.spyOn(SharedStore, "get");
		const setSpy = vi.spyOn(SharedStore, "set");

		getSpy.mockImplementation((key: string) => cache.get(key));
		setSpy.mockImplementation((key: string, value: unknown) => {
			cache.set(key, value);
		});

		const schema: IJsonSchema = {
			$schema: JsonSchemaHelper.SCHEMA_VERSION_2019,
			type: "string"
		};

		const failures1 = await JsonSchemaHelper.validate(schema, "first-value");
		const failures2 = await JsonSchemaHelper.validate(schema, "second-value");

		expect(failures1).toHaveLength(0);
		expect(failures2).toHaveLength(0);
		expect(cache.has(`${JsonSchemaHelper.CLASS_NAME}2019`)).toBe(true);
		expect(cache.has("asyncCache")).toBe(true);
		expect(setSpy).toHaveBeenCalledTimes(2);

		vi.restoreAllMocks();
	});

	test("Can convert undefined entity schema to JSON schema", () => {
		const jsonSchema = JsonSchemaHelper.entitySchemaToJsonSchema(undefined);

		expect(jsonSchema.$schema).toEqual(JsonSchemaHelper.SCHEMA_VERSION);
		expect(jsonSchema.type).toEqual("null");
		expect(jsonSchema.title).toBeUndefined();
	});

	test("Can set and use loggers during schema loading", async () => {
		const logCalls = {
			loading: [] as string[],
			loaded: [] as string[],
			failed: [] as string[]
		};

		JsonSchemaHelper.setLoggers({
			loadingSchema: async (uri: string) => {
				logCalls.loading.push(uri);
			},
			schemaLoaded: async (uri: string) => {
				logCalls.loaded.push(uri);
			},
			schemaLoadFailed: async (uri: string) => {
				logCalls.failed.push(uri);
			}
		});

		const schema: IJsonSchema = {
			type: "object",
			properties: {
				timestamp: {
					$ref: "https://schema.twindev.org/framework/TimestampMilliseconds.json"
				}
			},
			required: ["timestamp"]
		};

		await JsonSchemaHelper.validate(schema, {
			timestamp: 1234567890
		});

		// Reset loggers after test
		JsonSchemaHelper.setLoggers(undefined);

		// Loggers may be called for remote schema references depending on configuration
		// This test verifies loggers can be set and won't cause errors
		expect(logCalls.loading.length).toBe(1);
		expect(logCalls.loaded.length).toBe(1);
		expect(logCalls.failed.length).toBe(0);
	});

	test("Can handle logger failure for unknown schema URL", async () => {
		const logCalls = {
			loading: [] as string[],
			loaded: [] as string[],
			failed: [] as string[]
		};

		JsonSchemaHelper.setLoggers({
			loadingSchema: async (uri: string) => {
				logCalls.loading.push(uri);
			},
			schemaLoaded: async (uri: string) => {
				logCalls.loaded.push(uri);
			},
			schemaLoadFailed: async (uri: string) => {
				logCalls.failed.push(uri);
			}
		});

		const schema: IJsonSchema = {
			type: "object",
			properties: {
				data: {
					$ref: "https://invalid-unknown-url-that-does-not-exist.example.com/schema.json"
				}
			},
			required: ["data"]
		};

		const failures = await JsonSchemaHelper.validate(schema, {
			data: { value: "test" }
		});

		// Reset loggers after test
		JsonSchemaHelper.setLoggers(undefined);

		// Either validation fails, or loggers track the failure
		expect(failures.length).toBe(0);
		expect(logCalls.failed.length).toBe(1);
	});

	describe("Concurrent compileAsync", () => {
		const ajvStoreKey = `${JsonSchemaHelper.CLASS_NAME}2020`;

		afterEach(() => {
			SharedStore.remove(ajvStoreKey);
			SharedStore.remove(`${JsonSchemaHelper.CLASS_NAME}2019`);
			AsyncCache.clearCache();
			JsonSchemaHelper.setLoggers(undefined);
			vi.restoreAllMocks();
		});

		function createUnregisteredAllOfSchema(suffix: string): IJsonSchema {
			return {
				$schema: JsonSchemaHelper.SCHEMA_VERSION,
				$id: `https://test.concurrent-compile.example/Entity-${suffix}`,
				type: "object",
				properties: {
					name: { type: "string" }
				},
				required: ["name"],
				allOf: [
					{
						$ref: `https://test.concurrent-compile.example/UnregisteredListItem-${suffix}`
					}
				]
			};
		}

		test("parallel cold validate does not throw when $ref fetch fails (shared schema object)", async () => {
			vi.spyOn(FetchHelper, "fetchJson").mockRejectedValue(new Error("mocked fetch failure"));

			const schema = createUnregisteredAllOfSchema("shared-object");
			const parallelCount = 25;

			const results = await Promise.all(
				[...new Array(parallelCount).keys()].map(async index =>
					JsonSchemaHelper.validate(schema, { name: `item-${index}` })
				)
			);

			for (const failures of results) {
				expect(failures).toHaveLength(0);
			}
		});

		test("parallel cold validate does not throw when $ref fetch fails (distinct schema clones, same $id)", async () => {
			vi.spyOn(FetchHelper, "fetchJson").mockRejectedValue(new Error("mocked fetch failure"));

			const schemaId = "https://test.concurrent-compile.example/Entity-cloned";
			const ref = "https://test.concurrent-compile.example/UnregisteredListItem-cloned";
			const parallelCount = 25;

			const results = await Promise.all(
				[...new Array(parallelCount).keys()].map(async index =>
					JsonSchemaHelper.validate(
						{
							$schema: JsonSchemaHelper.SCHEMA_VERSION,
							$id: schemaId,
							type: "object",
							properties: { name: { type: "string" } },
							required: ["name"],
							allOf: [{ $ref: ref }]
						},
						{ name: `clone-${index}` }
					)
				)
			);

			for (const failures of results) {
				expect(failures).toHaveLength(0);
			}
		});

		test("repeated parallel cold starts stay stable across fresh AJV instances", async () => {
			vi.spyOn(FetchHelper, "fetchJson").mockRejectedValue(new Error("mocked fetch failure"));

			const parallelCount = 20;

			for (let attempt = 0; attempt < 15; attempt++) {
				SharedStore.remove(ajvStoreKey);
				AsyncCache.clearCache();
				const schema = createUnregisteredAllOfSchema(`attempt-${attempt}`);

				const results = await Promise.all(
					[...new Array(parallelCount).keys()].map(async index =>
						JsonSchemaHelper.validate(schema, { name: `a${attempt}-${index}` })
					)
				);

				for (const failures of results) {
					expect(failures).toHaveLength(0);
				}
			}
		});
	});
});
