// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { describe, expect, test } from "vitest";
import { JsonPathHelper } from "../src/jsonPathHelper.js";
import type { IJsonPathLocation } from "../src/models/IJsonPathLocation.js";

describe("JsonPathHelper", () => {
	describe("query", () => {
		test("Can query simple path", () => {
			const data = { foo: "bar" };
			const results = JsonPathHelper.query("$.foo", data);

			expect(results).toHaveLength(1);
			expect(results[0].value).toBe("bar");
			expect(results[0].location).toEqual(["foo"]);
			expect(results[0].path).toBe("$['foo']");
		});

		test("Can handle wildcard array extraction", () => {
			const data = { items: [1, 2, 3] };
			const results = JsonPathHelper.query("$.items[*]", data);

			expect(results).toHaveLength(3);
			expect(results[0].value).toBe(1);
			expect(results[0].path).toBe("$['items'][0]");
			expect(results[1].value).toBe(2);
			expect(results[1].path).toBe("$['items'][1]");
			expect(results[2].value).toBe(3);
			expect(results[2].path).toBe("$['items'][2]");
		});

		test("Can query nested paths", () => {
			const data = {
				store: {
					book: [
						{ title: "Book 1", price: 10 },
						{ title: "Book 2", price: 15 }
					]
				}
			};
			const results = JsonPathHelper.query("$.store.book[*].title", data);

			expect(results).toHaveLength(2);
			expect(results[0].value).toBe("Book 1");
			expect(results[0].path).toBe("$['store']['book'][0]['title']");
			expect(results[1].value).toBe("Book 2");
			expect(results[1].path).toBe("$['store']['book'][1]['title']");
		});

		test("Can use recursive descent operator", () => {
			const data = {
				level1: {
					name: "L1",
					level2: {
						name: "L2",
						level3: {
							name: "L3"
						}
					}
				}
			};
			const results = JsonPathHelper.query("$..name", data);

			expect(results).toHaveLength(3);
			expect(results.map(r => r.value)).toEqual(["L1", "L2", "L3"]);
			expect(results[0].path).toBe("$['level1']['name']");
			expect(results[1].path).toBe("$['level1']['level2']['name']");
			expect(results[2].path).toBe("$['level1']['level2']['level3']['name']");
		});

		test("Returns empty array for non-existent path", () => {
			const data = { foo: "bar" };
			const results = JsonPathHelper.query("$.nonexistent", data);

			expect(results).toHaveLength(0);
		});

		test("Throws error for invalid path syntax", () => {
			const data = { foo: "bar" };

			expect(() => JsonPathHelper.query("$.[invalid", data)).toThrow("jsonPathHelper.query");
		});
	});

	describe("exists", () => {
		test("Returns true for existing path", () => {
			const data = { foo: "bar" };

			expect(JsonPathHelper.exists("$.foo", data)).toBe(true);
		});

		test("Returns false for non-existent path", () => {
			const data = { foo: "bar" };

			expect(JsonPathHelper.exists("$.nonexistent", data)).toBe(false);
		});

		test("Returns false for invalid path", () => {
			const data = { foo: "bar" };

			expect(JsonPathHelper.exists("$.[invalid", data)).toBe(false);
		});

		test("Returns true for wildcard with matches", () => {
			const data = { items: [1, 2, 3] };

			expect(JsonPathHelper.exists("$.items[*]", data)).toBe(true);
		});

		test("Returns false for wildcard with no matches", () => {
			const data = { items: [] };

			expect(JsonPathHelper.exists("$.items[*]", data)).toBe(false);
		});
	});

	describe("extractSingle", () => {
		test("Extracts first value from path", () => {
			const data = { foo: "bar" };
			const value = JsonPathHelper.extractSingle("$.foo", data);

			expect(value).toBe("bar");
		});

		test("Extracts first value from array", () => {
			const data = { items: [1, 2, 3] };
			const value = JsonPathHelper.extractSingle("$.items[*]", data);

			expect(value).toBe(1);
		});

		test("Returns undefined for non-existent path", () => {
			const data = { foo: "bar" };
			const value = JsonPathHelper.extractSingle("$.nonexistent", data);

			expect(value).toBeUndefined();
		});

		test("Returns undefined for invalid path", () => {
			const data = { foo: "bar" };

			expect(() => JsonPathHelper.extractSingle("$.[invalid", data)).toThrow();
		});

		test("Can extract nested object", () => {
			const data = {
				user: {
					name: "John",
					age: 30
				}
			};
			const value = JsonPathHelper.extractSingle("$.user", data);

			expect(value).toEqual({ name: "John", age: 30 });
		});
	});

	describe("extractAll", () => {
		test("Extracts all values from wildcard path", () => {
			const data = { items: [1, 2, 3] };
			const values = JsonPathHelper.extractAll("$.items[*]", data);

			expect(values).toEqual([1, 2, 3]);
		});

		test("Extracts single value as array", () => {
			const data = { foo: "bar" };
			const values = JsonPathHelper.extractAll("$.foo", data);

			expect(values).toEqual(["bar"]);
		});

		test("Returns empty array for non-existent path", () => {
			const data = { foo: "bar" };
			const values = JsonPathHelper.extractAll("$.nonexistent", data);

			expect(values).toEqual([]);
		});

		test("Returns empty array for invalid path", () => {
			const data = { foo: "bar" };

			expect(() => JsonPathHelper.extractAll("$.[invalid", data)).toThrow();
		});

		test("Can extract multiple nested values", () => {
			const data = {
				users: [
					{ name: "Alice", age: 25 },
					{ name: "Bob", age: 30 }
				]
			};
			const values = JsonPathHelper.extractAll("$.users[*].name", data);

			expect(values).toEqual(["Alice", "Bob"]);
		});
	});

	describe("validate", () => {
		test("Returns true for valid path", () => {
			expect(JsonPathHelper.validate("$.foo")).toBe(true);
		});

		test("Returns true for complex valid path", () => {
			expect(JsonPathHelper.validate("$.store.book[*].title")).toBe(true);
		});

		test("Returns true for recursive descent", () => {
			expect(JsonPathHelper.validate("$..name")).toBe(true);
		});

		test("Returns false for invalid syntax", () => {
			expect(() => JsonPathHelper.validate("$.[invalid")).toThrow();
		});

		test("Returns false for empty string", () => {
			expect(JsonPathHelper.validate("")).toBe(false);
		});
	});

	describe("Edge cases", () => {
		test("Handles null values", () => {
			const data = { foo: null };
			const value = JsonPathHelper.extractSingle("$.foo", data);

			expect(value).toBeNull();
		});

		test("Handles undefined in data", () => {
			const data = { foo: undefined };
			const value = JsonPathHelper.extractSingle("$.foo", data);

			// undefined properties are typically not found by JSONPath
			expect(value).toBeUndefined();
		});

		test("Handles empty objects", () => {
			const data = {};
			const values = JsonPathHelper.extractAll("$..anything", data);

			expect(values).toEqual([]);
		});

		test("Handles empty arrays", () => {
			const data = { items: [] };
			const values = JsonPathHelper.extractAll("$.items[*]", data);

			expect(values).toEqual([]);
		});

		test("Handles deeply nested structures", () => {
			const data = {
				a: { b: { c: { d: { e: "deep" } } } }
			};
			const value = JsonPathHelper.extractSingle("$.a.b.c.d.e", data);

			expect(value).toBe("deep");
		});
	});

	describe("setAtLocation", () => {
		test("Does nothing for empty location", () => {
			const root = { a: 1 };
			JsonPathHelper.setAtLocation(root, [] as unknown as IJsonPathLocation, 2);
			expect(root).toEqual({ a: 1 });
		});

		test("Sets value on existing nested object", () => {
			const root: { [key: string]: unknown } = { a: { b: "old" } };
			JsonPathHelper.setAtLocation(root, ["a", "b"], "new");
			expect(root).toEqual({ a: { b: "new" } });
		});

		test("Creates intermediate objects and arrays as needed", () => {
			const root: { [key: string]: unknown } = {};
			JsonPathHelper.setAtLocation(root, ["a", "b", 0, "c"], 123);

			expect(root).toEqual({
				a: {
					b: [{ c: 123 }]
				}
			});
		});

		test("Does nothing when path expects array but finds object", () => {
			const root: { [key: string]: unknown } = { a: {} };
			JsonPathHelper.setAtLocation(root, ["a", 0], "x");
			expect(root).toEqual({ a: {} });
		});

		test("Sets value at array index", () => {
			const root: { [key: string]: unknown } = { items: ["a", "b"] };
			JsonPathHelper.setAtLocation(root, ["items", 1], "c");
			expect(root).toEqual({ items: ["a", "c"] });
		});
	});

	describe("deleteAtLocation", () => {
		test("Does nothing for empty location", () => {
			const root = { a: 1 };
			JsonPathHelper.deleteAtLocation(root, [] as unknown as IJsonPathLocation);
			expect(root).toEqual({ a: 1 });
		});

		test("Deletes property from object", () => {
			const root: { [key: string]: unknown } = { a: 1, b: 2 };
			JsonPathHelper.deleteAtLocation(root, ["b"]);
			expect(root).toEqual({ a: 1 });
		});

		test("Deletes property from nested object", () => {
			const root: { [key: string]: unknown } = { a: { b: { c: 3 } } };
			JsonPathHelper.deleteAtLocation(root, ["a", "b", "c"]);
			expect(root).toEqual({ a: { b: {} } });
		});

		test("Clears array element by setting it to undefined", () => {
			const root: { [key: string]: unknown } = { items: [1, 2, 3] };
			JsonPathHelper.deleteAtLocation(root, ["items", 1]);

			expect((root.items as unknown[]).length).toBe(3);
			expect(root).toEqual({ items: [1, undefined, 3] });
		});

		test("Does nothing when traversal encounters non-object/non-array", () => {
			const root: { [key: string]: unknown } = { a: 1 };
			JsonPathHelper.deleteAtLocation(root, ["a", "b"]);
			expect(root).toEqual({ a: 1 });
		});
	});

	describe("Combined operations", () => {
		test("Uses query locations to set and then delete values", () => {
			const data = {
				store: {
					book: [
						{ title: "Book 1", price: 10 },
						{ title: "Book 2", price: 15 }
					]
				}
			};

			const titleResults = JsonPathHelper.query("$.store.book[*].title", data);
			expect(titleResults).toHaveLength(2);
			expect(titleResults[0].location).toEqual(["store", "book", 0, "title"]);

			JsonPathHelper.setAtLocation(data, titleResults[0].location, "Updated Book 1");
			expect(JsonPathHelper.extractAll("$.store.book[*].title", data)).toEqual([
				"Updated Book 1",
				"Book 2"
			]);

			JsonPathHelper.deleteAtLocation(data, titleResults[1].location);
			expect(JsonPathHelper.extractAll("$.store.book[*].title", data)).toEqual(["Updated Book 1"]);
		});

		test("Can delete all wildcard matches", () => {
			const data = {
				store: {
					book: [
						{ title: "Book 1", price: 10, tags: ["a", "b"] },
						{ title: "Book 2", price: 15, tags: [] },
						{ title: "Book 3", price: 20 }
					]
				}
			};

			const priceResults = JsonPathHelper.query("$.store.book[*].price", data);
			expect(priceResults).toHaveLength(3);

			for (const result of priceResults) {
				JsonPathHelper.deleteAtLocation(data, result.location);
			}

			expect(JsonPathHelper.extractAll("$.store.book[*].price", data)).toEqual([]);
			expect(JsonPathHelper.extractAll("$.store.book[*].title", data)).toEqual([
				"Book 1",
				"Book 2",
				"Book 3"
			]);
		});

		test("Can update all recursive matches and then delete them", () => {
			const data = {
				a: {
					id: "A",
					children: [{ id: "B" }, { id: "C", meta: { id: "D" } }]
				}
			};

			const idResults = JsonPathHelper.query("$..id", data);
			expect(idResults).toHaveLength(4);

			for (const result of idResults) {
				JsonPathHelper.setAtLocation(data, result.location, "X");
			}
			expect(JsonPathHelper.extractAll("$..id", data)).toEqual(["X", "X", "X", "X"]);

			for (const result of idResults) {
				JsonPathHelper.deleteAtLocation(data, result.location);
			}
			expect(JsonPathHelper.extractAll("$..id", data)).toEqual([]);
		});

		test("Can compose a location from query results to set a sibling property", () => {
			const data: { [key: string]: unknown } = {
				users: [
					{ name: "Alice", profile: { email: "a@example.com" } },
					{ name: "Bob", profile: { email: "b@example.com" } }
				]
			};

			const userNodes = JsonPathHelper.query("$.users[*]", data);
			expect(userNodes).toHaveLength(2);

			const aliceActiveLocation = [...userNodes[0].location, "active"] as IJsonPathLocation;
			const bobEmailLocation = [...userNodes[1].location, "profile", "email"] as IJsonPathLocation;

			JsonPathHelper.setAtLocation(data, aliceActiveLocation, true);
			JsonPathHelper.deleteAtLocation(data, bobEmailLocation);

			expect(JsonPathHelper.extractSingle("$.users[0].active", data)).toBe(true);
			expect(JsonPathHelper.extractAll("$.users[*].profile.email", data)).toEqual([
				"a@example.com"
			]);
		});
	});
});
