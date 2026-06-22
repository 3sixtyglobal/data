// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Infer an existing property's type from a source type, or fall back to a default.
 */
export type JsonLdExistingProperty<T extends object, P extends PropertyKey, D> = T extends {
	[K in P]?: infer PropertyType;
}
	? Exclude<PropertyType, undefined>
	: D;
