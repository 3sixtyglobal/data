// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContainerType } from "./IJsonLdContainerType.js";
import type { IJsonLdContainerTypeArray } from "./IJsonLdContainerTypeArray.js";
import type { IJsonLdContextDefinition } from "./IJsonLdContextDefinition.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * An expanded term definition is used to describe the mapping between a term
 * and its expanded identifier, as well as other properties of the value
 * associated with the term when it is used as key in a node object.
 * @see https://www.w3.org/TR/json-ld11/#expanded-term-definition
 */
export type IJsonLdExpandedTermDefinition = {
	"@type"?: "@id" | "@json" | "@none" | "@vocab" | string;
	"@language"?: string;
	"@index"?: string;
	"@context"?: IJsonLdContextDefinition;
	"@prefix"?: boolean;
	"@propagate"?: boolean;
	"@protected"?: boolean;
} & (
	| {
			"@id"?: string | string[] | null;
			"@nest"?: "@nest" | string;
			"@container"?:
				| ("@list" | "@set" | IJsonLdContainerType)
				| ("@list" | "@set" | IJsonLdContainerType)[]
				| IJsonLdContainerTypeArray
				| null;
	  }
	| {
			"@reverse": string;
			"@container"?: "@set" | "@index" | null;
	  }
);
