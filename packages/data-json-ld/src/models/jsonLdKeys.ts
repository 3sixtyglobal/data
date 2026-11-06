// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Keep only JSON-LD keys ("@...") from a type.
 */
export type JsonLdKeys<T extends object> = Pick<T, Extract<keyof T, `@${string}`>>;
