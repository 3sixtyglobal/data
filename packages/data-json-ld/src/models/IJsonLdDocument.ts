// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionRoot } from "./IJsonLdContextDefinitionRoot.js";
import type { IJsonLdNodeObject } from "./IJsonLdNodeObject.js";
import type { IJsonLdValueObject } from "./IJsonLdValueObject.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * A JSON-LD document MUST be valid JSON text as described in [RFC8259],
 * or some format that can be represented in the JSON-LD internal representation
 * that is equivalent to valid JSON text.
 * @see https://www.w3.org/TR/json-ld11/#json-ld-grammar
 */
export type IJsonLdDocument =
	| IJsonLdNodeObject
	| IJsonLdNodeObject[]
	| {
			"@context"?: IJsonLdContextDefinitionRoot | undefined;
			"@graph"?:
				| IJsonLdValueObject
				| IJsonLdNodeObject
				| (IJsonLdValueObject | IJsonLdNodeObject)[]
				| undefined;
	  };
