// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionRoot } from "../models/IJsonLdContextDefinitionRoot.js";

/**
 * Add "@context" to a type.
 */
export type JsonLdObjectWithContext<T extends object, C = IJsonLdContextDefinitionRoot> = Omit<
	T,
	"@context"
> & {
	"@context": C;
};
