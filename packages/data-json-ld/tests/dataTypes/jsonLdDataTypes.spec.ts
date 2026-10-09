// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory, JsonSchemaHelper } from "@3sixty/data-core";
import * as CompiledValidators from "../../src/compiled/validators.js";
import { JsonLdDataTypes } from "../../src/dataTypes/jsonLdDataTypes.js";
import { JsonLdContexts } from "../../src/models/jsonLdContexts.js";
import JsonLdNodeObjectSchema from "../../src/schemas/JsonLdNodeObject.json" with { type: "json" };

describe("JsonLdDataTypes", () => {
	test("Can register the data types", async () => {
		JsonLdDataTypes.registerTypes();
		expect(DataTypeHandlerFactory.names()).toEqual([
			"https://schema.3sixty.global/json-ld/JsonLdDocument",
			"https://schema.3sixty.global/json-ld/JsonLdObject",
			"https://schema.3sixty.global/json-ld/JsonLdNodeObject",
			"https://schema.3sixty.global/json-ld/JsonLdNodePrimitive",
			"https://schema.3sixty.global/json-ld/JsonLdGraphObject",
			"https://schema.3sixty.global/json-ld/JsonLdValueObject",
			"https://schema.3sixty.global/json-ld/JsonLdListObject",
			"https://schema.3sixty.global/json-ld/JsonLdSetObject",
			"https://schema.3sixty.global/json-ld/JsonLdLanguageMap",
			"https://schema.3sixty.global/json-ld/JsonLdIndexMap",
			"https://schema.3sixty.global/json-ld/JsonLdIndexMapItem",
			"https://schema.3sixty.global/json-ld/JsonLdIdMap",
			"https://schema.3sixty.global/json-ld/JsonLdTypeMap",
			"https://schema.3sixty.global/json-ld/JsonLdIncludedBlock",
			"https://schema.3sixty.global/json-ld/JsonLdContextDefinition",
			"https://schema.3sixty.global/json-ld/JsonLdContextDefinitionElement",
			"https://schema.3sixty.global/json-ld/JsonLdContextDefinitionRoot",
			"https://schema.3sixty.global/json-ld/JsonLdExpandedTermDefinition",
			"https://schema.3sixty.global/json-ld/JsonLdListOrSetItem",
			"https://schema.3sixty.global/json-ld/JsonLdContainerType",
			"https://schema.3sixty.global/json-ld/JsonLdContainerTypeArray",
			"https://schema.3sixty.global/json-ld/JsonLdJsonPrimitive",
			"https://schema.3sixty.global/json-ld/JsonLdJsonArray",
			"https://schema.3sixty.global/json-ld/JsonLdJsonObject",
			"https://schema.3sixty.global/json-ld/JsonLdJsonValue"
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
