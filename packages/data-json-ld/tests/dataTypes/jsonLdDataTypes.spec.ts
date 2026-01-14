// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import { JsonLdDataTypes } from "../../src/dataTypes/jsonLdDataTypes.js";

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
});
