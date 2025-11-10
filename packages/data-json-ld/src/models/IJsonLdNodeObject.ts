// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdIdMap } from "./IJsonLdIdMap.js";
import type { IJsonLdIncludedBlock } from "./IJsonLdIncludedBlock.js";
import type { IJsonLdIndexMap } from "./IJsonLdIndexMap.js";
import type { IJsonLdLanguageMap } from "./IJsonLdLanguageMap.js";
import type { IJsonLdNodePrimitive } from "./IJsonLdNodePrimitive.js";
import type { IJsonLdObject } from "./IJsonLdObject.js";
import type { IJsonLdTypeMap } from "./IJsonLdTypeMap.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * A node object represents zero or more properties of a node
 * in the graph serialized by the JSON-LD document.
 * @see https://www.w3.org/TR/json-ld11/#node-objects
 */
export interface IJsonLdNodeObject extends IJsonLdObject {
	[key: string]:
		| IJsonLdNodePrimitive
		| IJsonLdNodePrimitive[]
		| IJsonLdLanguageMap
		| IJsonLdIndexMap
		| IJsonLdIncludedBlock
		| IJsonLdIdMap
		| IJsonLdTypeMap
		| IJsonLdNodeObject[keyof IJsonLdNodeObject];
}
