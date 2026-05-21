// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Omit optional "@context" from a type, inferring an existing context type from
 * the source type when available, otherwise using the provided default.
 */
export type JsonLdObjectWithNoContext<T extends object> = Omit<T, "@context">;
