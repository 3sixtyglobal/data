// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdOptionalKeys } from "./jsonLdOptionalKeys.js";

/**
 * Extract the required property names from a type.
 */
export type JsonLdRequiredKeys<T> = Exclude<keyof T, JsonLdOptionalKeys<T>>;
