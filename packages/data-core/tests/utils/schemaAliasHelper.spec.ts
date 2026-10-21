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
			{ from: "https://old.example/", to: "https://new.example/" },
			{ from: "/^https:\\/\\/other\\.example\\//", to: "https://new.example/" }
		]);

		expect(SchemaAliasHelper.getAliases()).toEqual([
			{ from: "https://old.example/", to: "https://new.example/" },
			{ from: "/^https:\\/\\/other\\.example\\//", to: "https://new.example/" }
		]);
	});

	test("Can fail to set the aliases when they are not an array", () => {
		expect(() =>
			SchemaAliasHelper.setAliases(undefined as unknown as { from: string; to: string }[])
		).toThrow(expect.objectContaining({ name: "GuardError" }));
	});

	test("Can fail to set the aliases when a pattern is invalid", () => {
		expect(() =>
			SchemaAliasHelper.setAliases([{ from: "/[/", to: "https://new.example/" }])
		).toThrow(
			expect.objectContaining({
				name: "GeneralError",
				message: "schemaAliasHelper.invalidPattern",
				properties: { pattern: "/[/" }
			})
		);
		expect(SchemaAliasHelper.getAliases()).toEqual([]);
	});

	test("Can add an alias and ignore a duplicate from", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/");
		SchemaAliasHelper.addAlias("https://old.example/", "https://other.example/");

		expect(SchemaAliasHelper.getAliases()).toEqual([
			{ from: "https://old.example/", to: "https://new.example/" }
		]);
	});

	test("Can fail to add an alias with an empty from", () => {
		expect(() => SchemaAliasHelper.addAlias("", "https://new.example/")).toThrow(
			expect.objectContaining({ name: "GuardError" })
		);
	});

	test("Can fail to add an alias with no to", () => {
		expect(() =>
			SchemaAliasHelper.addAlias("https://old.example/", undefined as unknown as string)
		).toThrow(expect.objectContaining({ name: "GuardError" }));
	});

	test("Can fail to add an alias with an invalid pattern", () => {
		expect(() => SchemaAliasHelper.addAlias("/(unclosed/", "https://new.example/")).toThrow(
			expect.objectContaining({
				name: "GeneralError",
				message: "schemaAliasHelper.invalidPattern",
				properties: { pattern: "/(unclosed/" }
			})
		);
	});

	test("Can fail to add an alias with a pattern that has no closing slash", () => {
		expect(() => SchemaAliasHelper.addAlias("/old", "https://new.example/")).toThrow(
			expect.objectContaining({ message: "schemaAliasHelper.invalidPattern" })
		);
	});

	test("Can fail to add an alias with an invalid flag", () => {
		expect(() => SchemaAliasHelper.addAlias("/old/z", "https://new.example/")).toThrow(
			expect.objectContaining({ message: "schemaAliasHelper.invalidPattern" })
		);
	});

	test("Can fail to add an alias with the sticky flag", () => {
		expect(() => SchemaAliasHelper.addAlias("/old/y", "https://new.example/")).toThrow(
			expect.objectContaining({ message: "schemaAliasHelper.invalidPattern" })
		);
	});

	test("Can resolve a value with a matching prefix", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://new.example/framework/Type"
		);
	});

	test("Can only match a prefix at the start of the value", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/");

		expect(SchemaAliasHelper.resolve("prefix-https://old.example/Type")).toEqual(
			"prefix-https://old.example/Type"
		);
	});

	test("Can use a prefix replacement literally", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/$&/");

		expect(SchemaAliasHelper.resolve("https://old.example/Type")).toEqual(
			"https://new.example/$&/Type"
		);
	});

	test("Can resolve a value with a matching pattern", () => {
		SchemaAliasHelper.addAlias("/^https:\\/\\/old\\.example\\//", "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://new.example/framework/Type"
		);
	});

	test("Can resolve a value with a pattern that contains unescaped slashes", () => {
		SchemaAliasHelper.addAlias("/^https://old.example/", "https://new.example");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://new.example/framework/Type"
		);
	});

	test("Can resolve a value with pattern flags", () => {
		SchemaAliasHelper.addAlias("/^https:\\/\\/OLD\\.example\\//i", "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/Type")).toEqual(
			"https://new.example/Type"
		);
	});

	test("Can resolve a value using capture group replacements", () => {
		SchemaAliasHelper.addAlias(
			"/^https:\\/\\/old\\.example\\/standards\\/(?<name>[^/]+)\\/(.+)$/",
			"https://new.example/$<name>/v2/$2"
		);

		expect(SchemaAliasHelper.resolve("https://old.example/standards/gs1/Product")).toEqual(
			"https://new.example/gs1/v2/Product"
		);
	});

	test("Can resolve a value using the first matching alias", () => {
		SchemaAliasHelper.addAlias("https://old.example/framework/", "https://first.example/");
		SchemaAliasHelper.addAlias("/^https:\\/\\/old\\.example\\//", "https://second.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/framework/Type")).toEqual(
			"https://first.example/Type"
		);
		expect(SchemaAliasHelper.resolve("https://old.example/other/Type")).toEqual(
			"https://second.example/other/Type"
		);
	});

	test("Can resolve repeatedly with a global pattern", () => {
		SchemaAliasHelper.addAlias("/^https:\\/\\/old\\.example\\//g", "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://old.example/A")).toEqual("https://new.example/A");
		expect(SchemaAliasHelper.resolve("https://old.example/B")).toEqual("https://new.example/B");
	});

	test("Can only match an anchored pattern at the start of the value", () => {
		SchemaAliasHelper.addAlias("/^https:\\/\\/old\\.example\\//", "https://new.example/");

		expect(SchemaAliasHelper.resolve("prefix-https://old.example/Type")).toEqual(
			"prefix-https://old.example/Type"
		);
	});

	test("Can leave a value unchanged when no alias matches", () => {
		SchemaAliasHelper.addAlias("https://old.example/", "https://new.example/");
		SchemaAliasHelper.addAlias("/^https:\\/\\/older\\.example\\//", "https://new.example/");

		expect(SchemaAliasHelper.resolve("https://other.example/framework/Type")).toEqual(
			"https://other.example/framework/Type"
		);
		expect(SchemaAliasHelper.resolve("test")).toEqual("test");
	});

	test("Can resolve aliases which survive a JSON round trip", () => {
		SchemaAliasHelper.setAliases([
			{ from: "/^https:\\/\\/old\\.example\\//i", to: "https://new.example/" }
		]);
		const serialised = JSON.parse(JSON.stringify(SchemaAliasHelper.getAliases()));

		SchemaAliasHelper.setAliases([]);
		SchemaAliasHelper.setAliases(serialised);

		expect(SchemaAliasHelper.resolve("https://OLD.example/Type")).toEqual(
			"https://new.example/Type"
		);
	});
});
