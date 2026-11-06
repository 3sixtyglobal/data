// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Omit "@type" from a type.
 */
export type JsonLdObjectWithNoAtType<T extends object> = Omit<T, "@type">;
