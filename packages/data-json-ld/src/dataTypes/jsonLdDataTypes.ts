// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHelper } from "@3sixty/data-core";
import * as CompiledValidators from "../compiled/validators.js";
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
				schema: JsonLdDocumentSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdDocument
			},
			{
				type: JsonLdTypes.Object,
				schema: JsonLdObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdObject
			},
			{
				type: JsonLdTypes.NodeObject,
				schema: JsonLdNodeObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdNodeObject
			},
			{
				type: JsonLdTypes.NodePrimitive,
				schema: JsonLdNodePrimitiveSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdNodePrimitive
			},
			{
				type: JsonLdTypes.GraphObject,
				schema: JsonLdGraphObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdGraphObject
			},
			{
				type: JsonLdTypes.ValueObject,
				schema: JsonLdValueObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdValueObject
			},
			{
				type: JsonLdTypes.ListObject,
				schema: JsonLdListObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdListObject
			},
			{
				type: JsonLdTypes.SetObject,
				schema: JsonLdSetObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdSetObject
			},
			{
				type: JsonLdTypes.LanguageMap,
				schema: JsonLdLanguageMapSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdLanguageMap
			},
			{
				type: JsonLdTypes.IndexMap,
				schema: JsonLdIndexMapSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdIndexMap
			},
			{
				type: JsonLdTypes.IndexMapItem,
				schema: JsonLdIndexMapItemSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdIndexMapItem
			},
			{
				type: JsonLdTypes.IdMap,
				schema: JsonLdIdMapSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdIdMap
			},
			{
				type: JsonLdTypes.TypeMap,
				schema: JsonLdTypeMapSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdTypeMap
			},
			{
				type: JsonLdTypes.IncludedBlock,
				schema: JsonLdIncludedBlockSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdIncludedBlock
			},
			{
				type: JsonLdTypes.ContextDefinition,
				schema: JsonLdContextDefinitionSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdContextDefinition
			},
			{
				type: JsonLdTypes.ContextDefinitionElement,
				schema: JsonLdContextDefinitionElementSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdContextDefinitionElement
			},
			{
				type: JsonLdTypes.ContextDefinitionRoot,
				schema: JsonLdContextDefinitionRootSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdContextDefinitionRoot
			},
			{
				type: JsonLdTypes.ExpandedTermDefinition,
				schema: JsonLdExpandedTermDefinitionSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdExpandedTermDefinition
			},
			{
				type: JsonLdTypes.ListOrSetItem,
				schema: JsonLdListOrSetItemSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdListOrSetItem
			},
			{
				type: JsonLdTypes.ContainerType,
				schema: JsonLdContainerTypeSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdContainerType
			},
			{
				type: JsonLdTypes.ContainerTypeArray,
				schema: JsonLdContainerTypeArraySchema,
				compiledValidator: CompiledValidators.CompiledJsonLdContainerTypeArray
			},
			{
				type: JsonLdTypes.JsonPrimitive,
				schema: JsonLdJsonPrimitiveSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdJsonPrimitive
			},
			{
				type: JsonLdTypes.JsonArray,
				schema: JsonLdJsonArraySchema,
				compiledValidator: CompiledValidators.CompiledJsonLdJsonArray
			},
			{
				type: JsonLdTypes.JsonObject,
				schema: JsonLdJsonObjectSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdJsonObject
			},
			{
				type: JsonLdTypes.JsonValue,
				schema: JsonLdJsonValueSchema,
				compiledValidator: CompiledValidators.CompiledJsonLdJsonValue
			}
		];

		DataTypeHelper.registerTypes(JsonLdContexts.Namespace, JsonLdContexts.JsonLdContext, types);
	}
}
