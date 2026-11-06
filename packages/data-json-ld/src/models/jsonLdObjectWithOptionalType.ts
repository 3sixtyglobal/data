// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdExistingPropertyEither } from "./jsonLdExistingPropertyEither.js";

/**
 * Add optional "type" to a type.
 */
export type JsonLdObjectWithOptionalType<
	T extends object,
	Ty = JsonLdExistingPropertyEither<T, "type", "@type", string | string[]>
> = Omit<T, "type" | "@type"> & {
	type?: Ty;
};
