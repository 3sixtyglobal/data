// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/* eslint-disable jsdoc/require-jsdoc */
import type { IJsonLdListOrSetItem } from "./IJsonLdListOrSetItem.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * A list represents an ordered set of values.
 * @see https://www.w3.org/TR/json-ld11/#lists-and-sets
 */
export interface IJsonLdListObject {
	"@list": IJsonLdListOrSetItem | IJsonLdListOrSetItem[];
	"@index"?: string | undefined;
}
