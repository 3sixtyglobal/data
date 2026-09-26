// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { describe, expect, test } from "vitest";
import { JsonSchemaFormats } from "../../src/utils/jsonSchemaFormats.js";

describe("JsonSchemaFormats", () => {
	test("Can validate a date-time format", () => {
		const format = JsonSchemaFormats["date-time"] as { validate: (value: string) => boolean };
		expect(format.validate("2026-09-25T10:00:00Z")).toEqual(true);
		expect(format.validate("not-a-date")).toEqual(false);
	});

	test("Can validate a uri format", () => {
		const format = JsonSchemaFormats.uri as (value: string) => boolean;
		expect(format("https://example.org/path")).toEqual(true);
		expect(format("not a uri")).toEqual(false);
	});
});
