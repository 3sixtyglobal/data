// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Keep JSON-LD keys as-is and prefix non-JSON-LD keys.
 */
export type JsonLdAliasKey<K extends string, Prefix extends string> = K extends `@${string}`
	? K
	: `${Prefix}:${K}`;
