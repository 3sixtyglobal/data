// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of JSON-LD data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const JsonLdContexts = {
	/**
	 * The canonical RDF namespace URI for JSON-LD.
	 */
	Namespace: "https://schema.twindev.org/json-ld/",

	/**
	 * The value to use in JSON-LD context for JSON-LD.
	 */
	Context: "https://schema.twindev.org/json-ld/",

	/**
	 * The JSON-LD Context URL for JSON-LD.
	 */
	JsonLdContext: "https://schema.twindev.org/json-ld/types.jsonld"
} as const;

/**
 * The contexts of JSON-LD data.
 */
export type JsonLdContexts = (typeof JsonLdContexts)[keyof typeof JsonLdContexts];
