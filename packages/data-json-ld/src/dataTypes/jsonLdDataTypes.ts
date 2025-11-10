// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory, type IJsonSchema } from "@twin.org/data-core";
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
		DataTypeHandlerFactory.register(`${JsonLdContexts.ContextRoot}${JsonLdTypes.Document}`, () => ({
			context: JsonLdContexts.ContextRoot,
			type: JsonLdTypes.Document,
			jsonSchema: async () => JsonLdDocumentSchema as IJsonSchema
		}));
		DataTypeHandlerFactory.register(`${JsonLdContexts.ContextRoot}${JsonLdTypes.Object}`, () => ({
			context: JsonLdContexts.ContextRoot,
			type: JsonLdTypes.Object,
			jsonSchema: async () => JsonLdObjectSchema as IJsonSchema
		}));
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.NodeObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.NodeObject,
				jsonSchema: async () => JsonLdNodeObjectSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.NodePrimitive}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.NodePrimitive,
				jsonSchema: async () => JsonLdNodePrimitiveSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.GraphObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.GraphObject,
				jsonSchema: async () => JsonLdGraphObjectSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ValueObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ValueObject,
				jsonSchema: async () => JsonLdValueObjectSchema as unknown as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ListObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ListObject,
				jsonSchema: async () => JsonLdListObjectSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ListObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ListObject,
				jsonSchema: async () => JsonLdListObjectSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.SetObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.SetObject,
				jsonSchema: async () => JsonLdSetObjectSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.LanguageMap}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.LanguageMap,
				jsonSchema: async () => JsonLdLanguageMapSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(`${JsonLdContexts.ContextRoot}${JsonLdTypes.IndexMap}`, () => ({
			context: JsonLdContexts.ContextRoot,
			type: JsonLdTypes.IndexMap,
			jsonSchema: async () => JsonLdIndexMapSchema as IJsonSchema
		}));
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.IndexMapItem}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.IndexMapItem,
				jsonSchema: async () => JsonLdIndexMapItemSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(`${JsonLdContexts.ContextRoot}${JsonLdTypes.IdMap}`, () => ({
			context: JsonLdContexts.ContextRoot,
			type: JsonLdTypes.IdMap,
			jsonSchema: async () => JsonLdIdMapSchema as IJsonSchema
		}));
		DataTypeHandlerFactory.register(`${JsonLdContexts.ContextRoot}${JsonLdTypes.TypeMap}`, () => ({
			context: JsonLdContexts.ContextRoot,
			type: JsonLdTypes.TypeMap,
			jsonSchema: async () => JsonLdTypeMapSchema as IJsonSchema
		}));
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.IncludedBlock}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.IncludedBlock,
				jsonSchema: async () => JsonLdIncludedBlockSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ContextDefinition}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ContextDefinition,
				jsonSchema: async () => JsonLdContextDefinitionSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ContextDefinitionElement}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ContextDefinitionElement,
				jsonSchema: async () => JsonLdContextDefinitionElementSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ContextDefinitionRoot}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ContextDefinitionRoot,
				jsonSchema: async () => JsonLdContextDefinitionRootSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ExpandedTermDefinition}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ExpandedTermDefinition,
				jsonSchema: async () => JsonLdExpandedTermDefinitionSchema as unknown as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ListOrSetItem}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ListOrSetItem,
				jsonSchema: async () => JsonLdListOrSetItemSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ContainerType}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ContainerType,
				jsonSchema: async () => JsonLdContainerTypeSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.ContainerTypeArray}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.ContainerTypeArray,
				jsonSchema: async () => JsonLdContainerTypeArraySchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.JsonPrimitive}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.JsonPrimitive,
				jsonSchema: async () => JsonLdJsonPrimitiveSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.JsonArray}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.JsonArray,
				jsonSchema: async () => JsonLdJsonArraySchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.JsonObject}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.JsonObject,
				jsonSchema: async () => JsonLdJsonObjectSchema as IJsonSchema
			})
		);
		DataTypeHandlerFactory.register(
			`${JsonLdContexts.ContextRoot}${JsonLdTypes.JsonValue}`,
			() => ({
				context: JsonLdContexts.ContextRoot,
				type: JsonLdTypes.JsonValue,
				jsonSchema: async () => JsonLdJsonValueSchema as IJsonSchema
			})
		);
	}
}
