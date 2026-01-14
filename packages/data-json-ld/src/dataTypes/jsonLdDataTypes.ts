// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHelper } from "@twin.org/data-core";
import { JsonLdContexts } from "../models/jsonLdContexts.js";
import { JsonLdTypes } from "../models/jsonLdTypes.js";
import JsonLdContainerTypeSchema from "../schemas/JsonLdContainerType.json" with { type: "json" };
import JsonLdContainerTypeArraySchema from "../schemas/JsonLdContainerTypeArray.json" with { type: "json" };
import JsonLdContextDefinitionSchema from "../schemas/JsonLdContextDefinition.json" with { type: "json" };
import JsonLdContextDefinitionElementSchema from "../schemas/JsonLdContextDefinitionElement.json" with { type: "json" };
import JsonLdContextDefinitionRootSchema from "../schemas/JsonLdContextDefinitionRoot.json" with { type: "json" };
import JsonLdDocumentSchema from "../schemas/JsonLdDocument.json" with { type: "json" };
import JsonLdExpandedTermDefinitionSchema from "../schemas/JsonLdExpandedTermDefinition.json" with { type: "json" };
import JsonLdGraphObjectSchema from "../schemas/JsonLdGraphObject.json" with { type: "json" };
import JsonLdIdMapSchema from "../schemas/JsonLdIdMap.json" with { type: "json" };
import JsonLdIncludedBlockSchema from "../schemas/JsonLdIncludedBlock.json" with { type: "json" };
import JsonLdIndexMapSchema from "../schemas/JsonLdIndexMap.json" with { type: "json" };
import JsonLdIndexMapItemSchema from "../schemas/JsonLdIndexMapItem.json" with { type: "json" };
import JsonLdJsonArraySchema from "../schemas/JsonLdJsonArray.json" with { type: "json" };
import JsonLdJsonObjectSchema from "../schemas/JsonLdJsonObject.json" with { type: "json" };
import JsonLdJsonPrimitiveSchema from "../schemas/JsonLdJsonPrimitive.json" with { type: "json" };
import JsonLdJsonValueSchema from "../schemas/JsonLdJsonValue.json" with { type: "json" };
import JsonLdLanguageMapSchema from "../schemas/JsonLdLanguageMap.json" with { type: "json" };
import JsonLdListObjectSchema from "../schemas/JsonLdListObject.json" with { type: "json" };
import JsonLdListOrSetItemSchema from "../schemas/JsonLdListOrSetItem.json" with { type: "json" };
import JsonLdNodeObjectSchema from "../schemas/JsonLdNodeObject.json" with { type: "json" };
import JsonLdNodePrimitiveSchema from "../schemas/JsonLdNodePrimitive.json" with { type: "json" };
import JsonLdObjectSchema from "../schemas/JsonLdObject.json" with { type: "json" };
import JsonLdSetObjectSchema from "../schemas/JsonLdSetObject.json" with { type: "json" };
import JsonLdTypeMapSchema from "../schemas/JsonLdTypeMap.json" with { type: "json" };
import JsonLdValueObjectSchema from "../schemas/JsonLdValueObject.json" with { type: "json" };

/**
 * Handle all the data types for JSON-LD.
 */
export class JsonLdDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		const types = [
			{
				type: JsonLdTypes.Document,
				schema: JsonLdDocumentSchema
			},
			{
				type: JsonLdTypes.Object,
				schema: JsonLdObjectSchema
			},
			{
				type: JsonLdTypes.NodeObject,
				schema: JsonLdNodeObjectSchema
			},
			{
				type: JsonLdTypes.NodePrimitive,
				schema: JsonLdNodePrimitiveSchema
			},
			{
				type: JsonLdTypes.GraphObject,
				schema: JsonLdGraphObjectSchema
			},
			{
				type: JsonLdTypes.ValueObject,
				schema: JsonLdValueObjectSchema
			},
			{
				type: JsonLdTypes.ListObject,
				schema: JsonLdListObjectSchema
			},
			{
				type: JsonLdTypes.SetObject,
				schema: JsonLdSetObjectSchema
			},
			{
				type: JsonLdTypes.LanguageMap,
				schema: JsonLdLanguageMapSchema
			},
			{
				type: JsonLdTypes.IndexMap,
				schema: JsonLdIndexMapSchema
			},
			{
				type: JsonLdTypes.IndexMapItem,
				schema: JsonLdIndexMapItemSchema
			},
			{
				type: JsonLdTypes.IdMap,
				schema: JsonLdIdMapSchema
			},
			{
				type: JsonLdTypes.TypeMap,
				schema: JsonLdTypeMapSchema
			},
			{
				type: JsonLdTypes.IncludedBlock,
				schema: JsonLdIncludedBlockSchema
			},
			{
				type: JsonLdTypes.ContextDefinition,
				schema: JsonLdContextDefinitionSchema
			},
			{
				type: JsonLdTypes.ContextDefinitionElement,
				schema: JsonLdContextDefinitionElementSchema
			},
			{
				type: JsonLdTypes.ContextDefinitionRoot,
				schema: JsonLdContextDefinitionRootSchema
			},
			{
				type: JsonLdTypes.ExpandedTermDefinition,
				schema: JsonLdExpandedTermDefinitionSchema
			},
			{
				type: JsonLdTypes.ListOrSetItem,
				schema: JsonLdListOrSetItemSchema
			},
			{
				type: JsonLdTypes.ContainerType,
				schema: JsonLdContainerTypeSchema
			},
			{
				type: JsonLdTypes.ContainerTypeArray,
				schema: JsonLdContainerTypeArraySchema
			},
			{
				type: JsonLdTypes.JsonPrimitive,
				schema: JsonLdJsonPrimitiveSchema
			},
			{
				type: JsonLdTypes.JsonArray,
				schema: JsonLdJsonArraySchema
			},
			{
				type: JsonLdTypes.JsonObject,
				schema: JsonLdJsonObjectSchema
			},
			{
				type: JsonLdTypes.JsonValue,
				schema: JsonLdJsonValueSchema
			}
		];

		DataTypeHelper.registerTypes(JsonLdContexts.Namespace, undefined, types);
	}
}
