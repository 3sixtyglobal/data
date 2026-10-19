// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { SchemaAliasHelper } from "../../src/utils/schemaAliasHelper.js";

describe("SchemaAliasHelper", () => {
	afterEach(() => {
		SchemaAliasHelper.setAliases([]);
	});

	test("Can get an empty alias list by default", () => {
		expect(SchemaAliasHelper.getAliases()).toEqual([]);
	});

	test("Can set the aliases", () => {
		SchemaAliasHelper.setAliases([
			{ from: /^https:\/\/old\.example\//, to: "https://new.example/" }
		]);

		expect(SchemaAliasHelper.getAliases()).toEqual([
			{ from: /^https:\/\/old\.example\//, to: "https://new.example/" }
		]);
	});

	test("Can add an alias and ignore a duplicate pattern", () => {
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//, "https://new.example/");
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//, "https://other.example/");

		expect(SchemaAliasHelper.getAliases()).toEqual([
			{ from: /^https:\/\/old\.example\//, to: "https://new.example/" }
		]);
	});

	test("Can resolve a value with a matching pattern", () => {
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//, "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://new.example/framework/Type"
		);
	});

	test("Can resolve a value using capture group replacements", () => {
		SchemaAliasHelper.addAlias(
			/^https:\/\/old\.example\/standards\/(?<name>[^/]+)\/(.+)$/,
			"https://new.example/$<name>/v2/$2"
		);

		expect(SchemaAliasHelper.resolve("https://old.example/standards/gs1/Product")).toEqual(
			"https://new.example/gs1/v2/Product"
		);
	});

	test("Can resolve a value using the first matching alias", () => {
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\/framework\//, "https://first.example/");
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//, "https://second.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://first.example/Type"
		);
		expect(SchemaAliasHelper.resolve("https://old.example/other/Type")).toEqual(
			"https://second.example/other/Type"
		);
	});

	test("Can resolve repeatedly with a global pattern", () => {
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//g, "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/A")).toEqual("https://new.example/A");
		expect(SchemaAliasHelper.resolve("https://old.example/B")).toEqual("https://new.example/B");
	});

	test("Can leave a value unchanged when no alias matches", () => {
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//, "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://other.example/framework/Type")).toEqual(
			"https://other.example/framework/Type"
		);
		expect(SchemaAliasHelper.resolve("test")).toEqual("test");
	});

	test("Can resolve a value with a matching string prefix", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://new.example/framework/Type"
		);
	});

	test("Can only match a string alias at the start of the value", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/");

		expect(SchemaAliasHelper.resolve("prefix-https://old.example/Type")).toEqual(
			"prefix-https://old.example/Type"
		);
	});

	test("Can use a string alias replacement literally", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/$&/");

		expect(SchemaAliasHelper.resolve("https://old.example/Type")).toEqual(
			"https://new.example/$&/Type"
		);
	});

	test("Can ignore a duplicate string alias but keep a pattern with the same text", () => {
		SchemaAliasHelper.addAlias("old", "first");
		SchemaAliasHelper.addAlias("old", "second");
		SchemaAliasHelper.addAlias(/old/, "third");

		expect(SchemaAliasHelper.getAliases()).toEqual([
			{ from: "old", to: "first" },
			{ from: /old/, to: "third" }
		]);
	});

	test("Can only match an anchored alias at the start of the value", () => {
		SchemaAliasHelper.addAlias(/^https:\/\/old\.example\//, "https://new.example/");

		expect(SchemaAliasHelper.resolve("prefix-https://old.example/Type")).toEqual(
			"prefix-https://old.example/Type"
		);
	});
});
