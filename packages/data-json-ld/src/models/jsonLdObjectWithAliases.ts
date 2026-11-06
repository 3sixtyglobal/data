// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdKeys } from "./jsonLdKeys.js";
import type { JsonLdWithAliases } from "./jsonLdWithAliases.js";

/**
 * Create a JSON-LD object shape containing only JSON-LD keys plus aliased
 * non-JSON-LD keys.
 */
export type JsonLdObjectWithAliases<T extends object, Prefix extends string> = JsonLdKeys<T> &
	JsonLdWithAliases<T, Prefix>;
