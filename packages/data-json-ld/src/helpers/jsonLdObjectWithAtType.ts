// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdExistingPropertyEither } from "./jsonLdExistingPropertyEither.js";

/**
 * Add "@type" to a type.
 */
export type JsonLdObjectWithAtType<
	T extends object,
	Ty = JsonLdExistingPropertyEither<T, "@type", "type", string | string[]>
> = Omit<T, "@type" | "type"> & {
	"@type": Ty;
};
