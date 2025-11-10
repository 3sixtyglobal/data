// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IValidationFailure } from "@twin.org/core";
import type { IJsonLdDocument } from "../../src/models/IJsonLdDocument.js";
import { JsonLdHelper } from "../../src/utils/jsonLdHelper.js";
import { JsonLdProcessor } from "../../src/utils/jsonLdProcessor.js";

describe("JsonLdHelper", () => {
	beforeAll(() => {
		JsonLdProcessor.addRedirect(
			/https?:\/\/schema.org\/?/,
			"https://schema.org/docs/jsonldcontext.jsonld"
		);
	});

	test("Can validate a document", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@type": "Person",
			name: "Jane Doe",
			jobTitle: "Professor",
			telephone: "(425) 123-4567",
			url: "http://www.janedoe.com"
		};

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(doc, validationFailures);
		expect(validationFailures).toEqual([]);
	});

	test("Can validate a document with multiple nested types", async () => {
		const doc = {
			"@context": "https://www.w3.org/ns/activitystreams",
			type: "Add",
			actor: {
				id: "did:iota:testnet:0x123456"
			},
			object: {
				"@context": "https://vocabulary.uncefact.org/",
				type: "Document",
				globalId: "24KEP051219453I002610796"
			},
			updated: 123
		};

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(doc, validationFailures);
		expect(validationFailures).toEqual([]);
	});

	test("Can validate a document with multiple types", async () => {
		const doc = {
			"@context": ["https://www.w3.org/ns/activitystreams", "https://schema.org"],
			type: ["Add", "ItemList"],
			actor: {
				id: "did:iota:testnet:0x123456"
			},
			object: {
				"@context": "https://vocabulary.uncefact.org/",
				type: "Document",
				globalId: "24KEP051219453I002610796"
			},
			updated: 123,
			itemListElement: [
				{
					"@context": "https://schema.org",
					"@type": "Person",
					name: "Jane Doe",
					jobTitle: "Professor",
					telephone: "(425) 123-4567",
					url: "http://www.janedoe.com"
				}
			]
		};

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(doc, validationFailures);
		expect(validationFailures).toEqual([]);
	});

	test("isType can find all the types in JSON-LD document", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://vocabulary.uncefact.org/unece-context-D23B.jsonld",
			type: ["Consignment", "Document"],
			globalId: "KE-123456-8"
		};

		expect(
			await JsonLdHelper.isType(doc, [
				"https://vocabulary.uncefact.org/Consignment",
				"https://vocabulary.uncefact.org/Document"
			])
		).toBe(true);
		expect(await JsonLdHelper.isType(doc, ["http://schema.org/Organization"])).toBe(false);
	});

	test("isType returns false when one of the required types is missing", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@type": ["Person", "Book"],
			name: "Jane Doe"
		};

		expect(
			await JsonLdHelper.isType(doc, ["http://schema.org/Person", "http://schema.org/Organization"])
		).toBe(false);
	});

	test("isType returns true when document has more types than required", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@type": ["Person", "Organization", "Book"],
			name: "Jane Doe"
		};

		expect(
			await JsonLdHelper.isType(doc, ["http://schema.org/Person", "http://schema.org/Organization"])
		).toBe(true);
	});

	test("isType returns true when only one @graph node matches required types", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": ["Person", "Organization"],
					name: "Jane Doe"
				},
				{
					"@type": "Book",
					name: "Some Book"
				}
			]
		};

		expect(
			await JsonLdHelper.isType(doc, ["http://schema.org/Person", "http://schema.org/Organization"])
		).toBe(true);
		expect(
			await JsonLdHelper.isType(doc, ["http://schema.org/Person", "http://schema.org/Book"])
		).toBe(false); // No single node has both Person and Book
	});

	test("isType throws when required type list is empty (invalid call)", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@type": ["Person"],
			name: "Jane Doe"
		};

		await expect(JsonLdHelper.isType(doc, [])).rejects.toMatchObject({
			source: "JsonLdHelper",
			name: "GuardError",
			message: "guard.arrayValue"
		});
	});
});
