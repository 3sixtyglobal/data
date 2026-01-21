// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of framework data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FrameworkContexts = {
	/**
	 * The canonical RDF namespace URI for Framework.
	 */
	Namespace: "https://schema.twindev.org/framework/",

	/**
	 * The value to use in JSON-LD context for Framework.
	 */
	Context: "https://schema.twindev.org/framework/",

	/**
	 * The JSON-LD Context URL for Framework.
	 */
	JsonLdContext: "https://schema.twindev.org/framework/types.jsonld"
} as const;

/**
 * The contexts of framework data.
 */
export type FrameworkContexts = (typeof FrameworkContexts)[keyof typeof FrameworkContexts];
