// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ArrayHelper, Guards, Is, type IValidationFailure } from "@twin.org/core";
import { DataTypeHelper, type ValidationMode } from "@twin.org/data-core";
import { nameof } from "@twin.org/nameof";
import { JsonLdProcessor } from "./jsonLdProcessor.js";
import type { IJsonLdDocument } from "../models/IJsonLdDocument.js";
import type { IJsonLdNodeObject } from "../models/IJsonLdNodeObject.js";
import type { IJsonLdNodePrimitive } from "../models/IJsonLdNodePrimitive.js";

/**
 * Class to help with JSON LD.
 */
export class JsonLdHelper {
	/**
	 * The class name.
	 * @internal
	 */
	public static readonly CLASS_NAME = nameof<JsonLdHelper>();

	/**
	 * Validate a JSON-LD document.
	 * @param document The JSON-LD document to validate.
	 * @param validationFailures The list of validation failures to add to.
	 * @param options Optional options for validation.
	 * @param options.failOnMissingType If true, will fail validation if the data type is missing, defaults to false.
	 * @param options.validationMode The validation mode to use, defaults to either.
	 * @returns True if the document was valid.
	 */
	public static async validate<T extends IJsonLdDocument = IJsonLdDocument>(
		document: T,
		validationFailures: IValidationFailure[],
		options?: {
			validationMode?: ValidationMode;
			failOnMissingType?: boolean;
		}
	): Promise<boolean> {
		if (Is.array<IJsonLdNodeObject>(document)) {
			// If the document is an array of nodes, validate each node
			for (const node of document) {
				await JsonLdHelper.validate(node, validationFailures, options);
			}
		} else if (Is.array<IJsonLdNodeObject>(document["@graph"])) {
			// If the graph is an array of nodes, validate each node
			for (const node of document["@graph"]) {
				await JsonLdHelper.validate(node, validationFailures, options);
			}
		} else if (Is.object<IJsonLdNodeObject>(document)) {
			// Expand the document to ensure we have the full context for types
			// As the data types in the factories are always fully qualified
			const expandedDocs = await JsonLdProcessor.expand(document);
			if (Is.arrayValue(expandedDocs)) {
				for (const expandedDoc of expandedDocs) {
					const expandedDataTypes = ArrayHelper.fromObjectOrArray(expandedDoc["@type"]);
					if (Is.arrayValue(expandedDataTypes)) {
						for (const expandedDataType of expandedDataTypes) {
							await DataTypeHelper.validate(
								"document",
								expandedDataType,
								document,
								validationFailures,
								options
							);
						}
					}
				}
			}
		}

		return validationFailures.length === 0;
	}

	/**
	 * Expand an object to a JSON-LD node object.
	 * @param object The object to expand.
	 * @returns The expanded JSON-LD node object.
	 */
	public static toNodeObject<T = unknown>(object: T): T & IJsonLdNodeObject {
		Guards.object<T>(JsonLdHelper.CLASS_NAME, nameof(object), object);
		return object as T & IJsonLdNodeObject;
	}

	/**
	 * Expand the JSON-LD document.
	 * @param document The JSON-LD document to expand.
	 * @returns The expanded JSON-LD document.
	 */
	public static async expand(document: IJsonLdDocument): Promise<IJsonLdNodeObject[]> {
		Guards.object<IJsonLdDocument>(JsonLdHelper.CLASS_NAME, nameof(document), document);
		return JsonLdProcessor.expand(document);
	}

	/**
	 * Expand the JSON-LD document and check if it is of a specific type.
	 * @param documentOrExpanded The JSON-LD document to check or already expanded document.
	 * @param type The type to check for.
	 * @returns True if the document is of the specified type.
	 */
	public static async isType(
		documentOrExpanded: IJsonLdDocument | IJsonLdNodeObject[],
		type: string[]
	): Promise<boolean> {
		const expanded = await JsonLdHelper.getExpandedDocument(documentOrExpanded);
		Guards.arrayValue(JsonLdHelper.CLASS_NAME, nameof(type), type);

		if (Is.arrayValue(expanded)) {
			for (const item of expanded) {
				const types = ArrayHelper.fromObjectOrArray(item["@type"]);
				if (Is.arrayValue(types)) {
					// All required types must be present in this item's @type array
					const itemTypes = new Set(types);
					if (type.every(t => itemTypes.has(t))) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Get the types from the document.
	 * @param documentOrExpanded The JSON-LD document to check or already expanded document.
	 * @returns The type(s) extracted from the document.
	 */
	public static async getType(
		documentOrExpanded: IJsonLdDocument | IJsonLdNodeObject[]
	): Promise<string[]> {
		const expanded = await JsonLdHelper.getExpandedDocument(documentOrExpanded);

		const types: Set<string> = new Set<string>();
		const props = ["@type", "type"];

		for (const expandedDoc of expanded) {
			for (const prop of props) {
				const expandedProps = ArrayHelper.fromObjectOrArray(expandedDoc[prop]);
				if (Is.arrayValue(expandedProps)) {
					for (const expandedProp of expandedProps) {
						const arr = ArrayHelper.fromObjectOrArray(expandedProp);
						for (const arrValue of arr) {
							if (Is.stringValue(arrValue)) {
								types.add(arrValue);
							}
						}
					}
				}
			}
		}

		return Array.from(types);
	}

	/**
	 * Get the id from the document.
	 * @param documentOrExpanded The JSON-LD document to get the id from or already expanded document.
	 * @param additionalIdProperties Optional additional properties to check for the id, in addition to "@id" and "id".
	 * @returns The id extracted from the document.
	 */
	public static async getId(
		documentOrExpanded: IJsonLdDocument | IJsonLdNodeObject[],
		additionalIdProperties?: string[]
	): Promise<string | undefined> {
		const expanded = await JsonLdHelper.getExpandedDocument(documentOrExpanded);

		const props = ["@id", "id", ...(additionalIdProperties ?? [])];

		for (const expandedDoc of expanded) {
			for (const prop of props) {
				const expandedProps = ArrayHelper.fromObjectOrArray(expandedDoc[prop]);
				if (Is.arrayValue(expandedProps)) {
					for (const expandedProp of expandedProps) {
						const arr = ArrayHelper.fromObjectOrArray(expandedProp);
						for (const arrValue of arr) {
							if (Is.stringValue(arrValue)) {
								return arrValue;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Get property values by a single full expanded property name.
	 * @param documentOrExpanded The JSON-LD document to get the property from or already expanded document.
	 * @param propertyFullName The full expanded property name.
	 * @param language Optional filter values by their language property.
	 * @returns Matching property values for the input property.
	 */
	public static async getPropertyValue(
		documentOrExpanded: IJsonLdDocument | IJsonLdNodeObject[],
		propertyFullName: string,
		language?: string
	): Promise<IJsonLdNodePrimitive[] | undefined> {
		const results = await JsonLdHelper.getPropertyValues(
			documentOrExpanded,
			[propertyFullName],
			language
		);

		return results[0];
	}

	/**
	 * Get property values by their full expanded property names.
	 * @param documentOrExpanded The JSON-LD document to get the property from or already expanded document.
	 * @param propertyFullNames The full expanded property names.
	 * @param language Optional filter values by their language property.
	 * @returns Matching property values for each input property, in the same index order.
	 */
	public static async getPropertyValues(
		documentOrExpanded: IJsonLdDocument | IJsonLdNodeObject[],
		propertyFullNames: string[],
		language?: string
	): Promise<(IJsonLdNodePrimitive[] | undefined)[]> {
		const expanded = await JsonLdHelper.getExpandedDocument(documentOrExpanded);

		Guards.arrayValue(JsonLdHelper.CLASS_NAME, nameof(propertyFullNames), propertyFullNames);
		if (Is.stringValue(language)) {
			Guards.stringValue(JsonLdHelper.CLASS_NAME, nameof(language), language);
		}
		const languageLower = Is.stringValue(language) ? language.toLowerCase() : undefined;
		const result: (IJsonLdNodePrimitive[] | undefined)[] = [];

		for (const propertyFullName of propertyFullNames) {
			Guards.stringValue(JsonLdHelper.CLASS_NAME, nameof(propertyFullName), propertyFullName);
			const values: IJsonLdNodePrimitive[] = [];

			for (const expandedDoc of expanded) {
				const propValue = expandedDoc[propertyFullName];
				if (!Is.empty(propValue)) {
					const expandedProps = ArrayHelper.fromObjectOrArray(propValue);
					if (Is.arrayValue(expandedProps)) {
						for (const expandedProp of expandedProps) {
							if (
								Is.object<{ "@value"?: IJsonLdNodePrimitive; "@language"?: string }>(expandedProp)
							) {
								if (!Is.empty(expandedProp["@value"])) {
									let shouldAdd = true;
									if (Is.stringValue(languageLower)) {
										const itemLanguage = Is.stringValue(expandedProp["@language"])
											? expandedProp["@language"].toLowerCase()
											: undefined;
										shouldAdd = itemLanguage === languageLower;
									}
									if (shouldAdd) {
										values.push(expandedProp["@value"]);
									}
								} else if (!Is.stringValue(languageLower)) {
									values.push(expandedProp);
								}
							} else if (
								Is.stringValue(expandedProp) ||
								Is.boolean(expandedProp) ||
								Is.number(expandedProp)
							) {
								if (!Is.stringValue(languageLower)) {
									values.push(expandedProp);
								}
							}
						}
					}
				}
			}

			result.push(values.length > 0 ? values : undefined);
		}

		return result;
	}

	/**
	 * Prefix all properties in the document with the provided prefix, except for JSON-LD properties.
	 * This is useful for ensuring that all properties are fully qualified with a namespace.
	 * For example, if the prefix is "ex" and the document has a property "name", it will be transformed to "ex:name".
	 * @param nodeObject The JSON-LD node object to prefix properties on.
	 * @param prefix The prefix to add to the properties.
	 * @param properties Optional list of properties to prefix. If not provided, all properties except for JSON-LD properties.
	 * @returns A new JSON-LD node object with the properties prefixed.
	 */
	public static prefixProperties<T extends IJsonLdNodeObject>(
		nodeObject: T,
		prefix: string,
		properties?: string[]
	): IJsonLdNodeObject {
		Guards.object<IJsonLdNodeObject>(JsonLdHelper.CLASS_NAME, nameof(nodeObject), nodeObject);
		Guards.stringValue(JsonLdHelper.CLASS_NAME, nameof(prefix), prefix);
		const normalizedPrefix = prefix.endsWith(":") ? prefix.slice(0, -1) : prefix;
		const hasNoPropertiesFilter = !Is.arrayValue(properties);

		const prefixedNodeObject: IJsonLdNodeObject = {};

		for (const key in nodeObject) {
			const value = nodeObject[key];
			if (
				Is.stringValue(key) &&
				!key.startsWith("@") &&
				(hasNoPropertiesFilter || properties.includes(key))
			) {
				prefixedNodeObject[`${normalizedPrefix}:${key}`] = value;
			} else {
				prefixedNodeObject[key] = value;
			}
		}

		return prefixedNodeObject;
	}

	/**
	 * Strip a prefix from properties in the document, except for JSON-LD properties.
	 * This is useful for converting fully qualified namespaced properties back to local names.
	 * For example, if the prefix is "ex" and the document has a property "ex:name", it will be transformed to "name".
	 * @param nodeObject The JSON-LD node object to strip prefixed properties from.
	 * @param prefix The prefix to remove from the properties.
	 * @param properties Optional list of unprefixed properties to strip. If not provided, all matching prefixed properties.
	 * @returns A new JSON-LD node object with the prefix stripped from matching properties.
	 */
	public static stripPrefixProperties<T extends IJsonLdNodeObject>(
		nodeObject: T,
		prefix: string,
		properties?: string[]
	): IJsonLdNodeObject {
		Guards.object<IJsonLdNodeObject>(JsonLdHelper.CLASS_NAME, nameof(nodeObject), nodeObject);
		Guards.stringValue(JsonLdHelper.CLASS_NAME, nameof(prefix), prefix);
		const normalizedPrefix = prefix.endsWith(":") ? prefix.slice(0, -1) : prefix;
		const hasNoPropertiesFilter = !Is.arrayValue(properties);

		const strippedNodeObject: IJsonLdNodeObject = {};

		for (const key in nodeObject) {
			const value = nodeObject[key];
			if (Is.stringValue(key) && !key.startsWith("@") && key.startsWith(`${normalizedPrefix}:`)) {
				const strippedKey = key.slice(normalizedPrefix.length + 1);
				if (hasNoPropertiesFilter || properties.includes(strippedKey)) {
					strippedNodeObject[strippedKey] = value;
				} else {
					strippedNodeObject[key] = value;
				}
			} else {
				strippedNodeObject[key] = value;
			}
		}

		return strippedNodeObject;
	}

	/**
	 * Get an expanded JSON-LD document from either compact or expanded input.
	 * @param documentOrExpanded The JSON-LD document or expanded document.
	 * @returns The expanded JSON-LD document.
	 * @internal
	 */
	private static async getExpandedDocument(
		documentOrExpanded: IJsonLdDocument | IJsonLdNodeObject[]
	): Promise<IJsonLdNodeObject[]> {
		if (Is.array<IJsonLdNodeObject>(documentOrExpanded)) {
			Guards.array<IJsonLdNodeObject>(
				JsonLdHelper.CLASS_NAME,
				nameof(documentOrExpanded),
				documentOrExpanded
			);

			return documentOrExpanded;
		}

		Guards.object<IJsonLdDocument>(
			JsonLdHelper.CLASS_NAME,
			nameof(documentOrExpanded),
			documentOrExpanded
		);

		return JsonLdProcessor.expand(documentOrExpanded);
	}
}
