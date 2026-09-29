// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory, JsonSchemaHelper } from "@twin.org/data-core";
import * as CompiledValidators from "../../src/compiled/validators.js";
import { JsonLdDataTypes } from "../../src/dataTypes/jsonLdDataTypes.js";
import { JsonLdContexts } from "../../src/models/jsonLdContexts.js";
import JsonLdNodeObjectSchema from "../../src/schemas/JsonLdNodeObject.json" with { type: "json" };

describe("JsonLdDataTypes", () => {
	test("Can register the data types", async () => {
		JsonLdDataTypes.registerTypes();
		expect(DataTypeHandlerFactory.names()).toEqual([
			"https://schema.twindev.org/json-ld/JsonLdDocument",
			"https://schema.twindev.org/json-ld/JsonLdObject",
			"https://schema.twindev.org/json-ld/JsonLdNodeObject",
			"https://schema.twindev.org/json-ld/JsonLdNodePrimitive",
			"https://schema.twindev.org/json-ld/JsonLdGraphObject",
			"https://schema.twindev.org/json-ld/JsonLdValueObject",
			"https://schema.twindev.org/json-ld/JsonLdListObject",
			"https://schema.twindev.org/json-ld/JsonLdSetObject",
			"https://schema.twindev.org/json-ld/JsonLdLanguageMap",
			"https://schema.twindev.org/json-ld/JsonLdIndexMap",
			"https://schema.twindev.org/json-ld/JsonLdIndexMapItem",
			"https://schema.twindev.org/json-ld/JsonLdIdMap",
			"https://schema.twindev.org/json-ld/JsonLdTypeMap",
			"https://schema.twindev.org/json-ld/JsonLdIncludedBlock",
			"https://schema.twindev.org/json-ld/JsonLdContextDefinition",
			"https://schema.twindev.org/json-ld/JsonLdContextDefinitionElement",
			"https://schema.twindev.org/json-ld/JsonLdContextDefinitionRoot",
			"https://schema.twindev.org/json-ld/JsonLdExpandedTermDefinition",
			"https://schema.twindev.org/json-ld/JsonLdListOrSetItem",
			"https://schema.twindev.org/json-ld/JsonLdContainerType",
			"https://schema.twindev.org/json-ld/JsonLdContainerTypeArray",
			"https://schema.twindev.org/json-ld/JsonLdJsonPrimitive",
			"https://schema.twindev.org/json-ld/JsonLdJsonArray",
			"https://schema.twindev.org/json-ld/JsonLdJsonObject",
			"https://schema.twindev.org/json-ld/JsonLdJsonValue"
		]);
	});

	test("Registers a compiled validator for every data type", async () => {
		JsonLdDataTypes.registerTypes();

		for (const [name, validator] of Object.entries(CompiledValidators)) {
			const handler = DataTypeHandlerFactory.get(
				`${JsonLdContexts.Namespace}${name.replace(/^Compiled/, "")}`
			);
			expect(await handler.compiledValidator?.()).toEqual(validator);
		}
		expect(Object.keys(CompiledValidators)).toHaveLength(25);
	});

	test.each([
		["a valid node object", { "@id": "https://example.org/1", "@type": "Thing" }, true],
		["a node object with a numeric id", { "@id": 1 }, false],
		["a node object with an invalid context", { "@context": 1 }, false]
	])("Compiled validator matches JsonSchemaHelper for %s", async (description, data, expected) => {
		JsonLdDataTypes.registerTypes();
		const failures = await JsonSchemaHelper.validate(JsonLdNodeObjectSchema, data);

		expect(CompiledValidators.CompiledJsonLdNodeObject(data)).toEqual(expected);
		expect(
			JsonSchemaHelper.validateCompiled(CompiledValidators.CompiledJsonLdNodeObject, data)
		).toEqual(failures);
	});
});
