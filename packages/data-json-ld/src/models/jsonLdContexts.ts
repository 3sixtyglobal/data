// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of JSON-LD data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const JsonLdContexts = {
	/**
	 * Namespace.
	 */
	Namespace: "https://schema.twindev.org/json-ld/"
} as const;

/**
 * The contexts of JSON-LD data.
 */
export type JsonLdContexts = (typeof JsonLdContexts)[keyof typeof JsonLdContexts];
