// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { JsonLdProcessor } from "../../src/utils/jsonLdProcessor.js";
import schemaOrgContext from "../fixtures/schemaOrg.json" with { type: "json" };

/**
 * URLs the loader may request for schema.org `@context` strings; matches remote variants without hitting the network.
 */
export const SCHEMA_ORG_CONTEXT_URLS: readonly string[] = [
	"https://schema.org",
	"http://schema.org",
	"https://schema.org/",
	"http://schema.org/",
	"https://schema.org/docs/jsonldcontext.jsonld"
];

/**
 * Seed the document cache with the local schema.org JSON-LD context fixture for offline tests.
 */
export async function seedSchemaOrgDocumentCache(): Promise<void> {
	for (const url of SCHEMA_ORG_CONTEXT_URLS) {
		await JsonLdProcessor.documentCacheAdd(url, schemaOrgContext);
	}
}
