// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdExistingProperty } from "./jsonLdExistingProperty.js";
import type { IJsonLdContextDefinitionRoot } from "../models/IJsonLdContextDefinitionRoot.js";

/**
 * Add optional "@context" to a type, inferring an existing context type from
 * the source type when available, otherwise using the provided default.
 */
export type JsonLdObjectWithOptionalContext<
	T extends object,
	C = JsonLdExistingProperty<T, "@context", IJsonLdContextDefinitionRoot>
> = Omit<T, "@context"> & {
	"@context"?: C;
};
