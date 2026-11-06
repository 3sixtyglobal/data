// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdAliasKey } from "./jsonLdAliasKey.js";
import type { JsonLdOptionalKeys } from "./jsonLdOptionalKeys.js";
import type { JsonLdRequiredKeys } from "./jsonLdRequiredKeys.js";

/**
 * Remap an object type so JSON-LD keys ("@...") are preserved and
 * non-JSON-LD keys are exposed as `Prefix:key` aliases, while preserving
 * each key's original required/optional status.
 */
export type JsonLdWithAliases<T extends object, Prefix extends string> = {
	[K in Extract<JsonLdRequiredKeys<T>, string> as JsonLdAliasKey<K, Prefix>]: T[K];
} & {
	[K in Extract<JsonLdOptionalKeys<T>, string> as JsonLdAliasKey<K, Prefix>]?: T[K];
};
