// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Omit "@id" from a type.
 */
export type JsonLdObjectWithNoAtId<T extends object> = Omit<T, "@id">;
