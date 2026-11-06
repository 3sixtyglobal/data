// Copyright 2026 IOTA Stiftung.
// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionRoot } from "./IJsonLdContextDefinitionRoot.js";
import type { JsonLdExistingProperty } from "./jsonLdExistingProperty.js";

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
