// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Extract the optional property names from a type.
 */
export type JsonLdOptionalKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
