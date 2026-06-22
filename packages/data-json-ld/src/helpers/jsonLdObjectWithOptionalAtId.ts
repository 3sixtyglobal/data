// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdExistingPropertyEither } from "./jsonLdExistingPropertyEither.js";

/**
 * Add optional "@id" to a type.
 */
export type JsonLdObjectWithOptionalAtId<
	T extends object,
	Id = JsonLdExistingPropertyEither<T, "@id", "id", string>
> = Omit<T, "@id" | "id"> & {
	"@id"?: Id;
};
