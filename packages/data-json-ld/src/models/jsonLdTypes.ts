// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The types of JSON-LD data.
 */
export const JsonLdTypes = {
	/**
	 * Represents JSON-LD Document.
	 */
	Document: "JsonLdDocument",

	/**
	 * Represents JSON-LD Object.
	 */
	Object: "JsonLdObject",

	/**
	 * Represents JSON-LD Node Object.
	 */
	NodeObject: "JsonLdNodeObject",

	/**
	 * Represents JSON-LD Node Primitive.
	 */
	NodePrimitive: "JsonLdNodePrimitive",

	/**
	 * Represents JSON-LD Graph Object.
	 */
	GraphObject: "JsonLdGraphObject",

	/**
	 * Represents JSON-LD Value Object.
	 */
	ValueObject: "JsonLdValueObject",

	/**
	 * Represents JSON-LD List Object.
	 */
	ListObject: "JsonLdListObject",

	/**
	 * Represents JSON-LD Set Object.
	 */
	SetObject: "JsonLdSetObject",

	/**
	 * Represents JSON-LD Language Map.
	 */
	LanguageMap: "JsonLdLanguageMap",

	/**
	 * Represents JSON-LD Index Map.
	 */
	IndexMap: "JsonLdIndexMap",

	/**
	 * Represents JSON-LD Index Map Item.
	 */
	IndexMapItem: "JsonLdIndexMapItem",

	/**
	 * Represents JSON-LD Id Map.
	 */
	IdMap: "JsonLdIdMap",

	/**
	 * Represents JSON-LD Type Map.
	 */
	TypeMap: "JsonLdTypeMap",

	/**
	 * Represents JSON-LD Included block.
	 */
	IncludedBlock: "JsonLdIncludedBlock",

	/**
	 * Represents JSON-LD Context Definition.
	 */
	ContextDefinition: "JsonLdContextDefinition",

	/**
	 * Represents JSON-LD Context Definition Element.
	 */
	ContextDefinitionElement: "JsonLdContextDefinitionElement",

	/**
	 * Represents JSON-LD Context Definition Root.
	 */
	ContextDefinitionRoot: "JsonLdContextDefinitionRoot",

	/**
	 * Represents JSON-LD Expanded Term Definition.
	 */
	ExpandedTermDefinition: "JsonLdExpandedTermDefinition",

	/**
	 * Represents JSON-LD Keyword.
	 */
	Keyword: "JsonLdKeyword",

	/**
	 * Represents JSON-LD List or Set Item.
	 */
	ListOrSetItem: "JsonLdListOrSetItem",

	/**
	 * Represents JSON-LD Container Type.
	 */
	ContainerType: "JsonLdContainerType",

	/**
	 * Represents JSON-LD Container Type Array.
	 */
	ContainerTypeArray: "JsonLdContainerTypeArray",

	/**
	 * Represents JSON-LD JSON Primitive.
	 */
	JsonPrimitive: "JsonLdJsonPrimitive",

	/**
	 * Represents JSON-LD JSON Array.
	 */
	JsonArray: "JsonLdJsonArray",

	/**
	 * Represents JSON-LD JSON Object.
	 */
	JsonObject: "JsonLdJsonObject",

	/**
	 * Represents JSON-LD JSON Value.
	 */
	JsonValue: "JsonLdJsonValue"
} as const;

/**
 * The types of JSON-LD data.
 */
export type JsonLdTypes = (typeof JsonLdTypes)[keyof typeof JsonLdTypes];
