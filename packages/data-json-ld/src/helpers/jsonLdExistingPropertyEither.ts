// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdExistingProperty } from "./jsonLdExistingProperty.js";

/**
 * Infer an existing property's type from either of two source properties,
 * or fall back to a default when neither exists.
 */
export type JsonLdExistingPropertyEither<
	T extends object,
	P1 extends PropertyKey,
	P2 extends PropertyKey,
	D
> = [JsonLdExistingProperty<T, P1, never> | JsonLdExistingProperty<T, P2, never>] extends [never]
	? D
	: JsonLdExistingProperty<T, P1, never> | JsonLdExistingProperty<T, P2, never>;
