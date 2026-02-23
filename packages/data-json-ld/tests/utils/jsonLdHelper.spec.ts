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

	test("isType accepts already expanded documents", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@id": "urn:uuid:1234",
					"@type": ["Person", "Organization"]
				},
				{
					"@type": ["Book"]
				}
			]
		};
		const expandedDoc = await JsonLdHelper.expand(doc);

		expect(
			await JsonLdHelper.isType(expandedDoc, [
				"http://schema.org/Person",
				"http://schema.org/Organization"
			])
		).toBe(true);
		expect(
			await JsonLdHelper.isType(expandedDoc, ["http://schema.org/Person", "http://schema.org/Book"])
		).toBe(false);
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

	test("getType returns expanded @type values", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@type": ["Person", "Book"]
		};

		const types = await JsonLdHelper.getType(doc);
		expect(types).toEqual(
			expect.arrayContaining(["http://schema.org/Person", "http://schema.org/Book"])
		);
	});

	test("getType handles `type` property and returns unique expanded values", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			type: ["Person", "Person", "Book"]
		};

		const types = await JsonLdHelper.getType(doc);
		expect(types.length).toEqual(2);
		expect(types[0]).toBe("http://schema.org/Person");
		expect(types[1]).toBe("http://schema.org/Book");
	});

	test("getType accepts already expanded documents", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@id": "urn:uuid:1234",
					"@type": ["Person", "Person"]
				},
				{
					"@type": "Book"
				}
			]
		};
		const expandedDoc = await JsonLdHelper.expand(doc);

		const types = await JsonLdHelper.getType(expandedDoc);
		expect(types).toEqual(
			expect.arrayContaining(["http://schema.org/Person", "http://schema.org/Book"])
		);
		expect(types.length).toBe(2);
	});

	test("getId returns @id or id when present and undefined otherwise", async () => {
		const docWithAtId: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@id": "urn:uuid:1234",
			"@type": "Person"
		};

		const docWithId: IJsonLdDocument = {
			"@context": "https://schema.org",
			id: "did:iota:testnet:0xabc",
			"@type": "Person"
		};

		const docWithoutId: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@type": "Person"
		};

		expect(await JsonLdHelper.getId(docWithAtId)).toBe("urn:uuid:1234");
		expect(await JsonLdHelper.getId(docWithId)).toBe("did:iota:testnet:0xabc");
		expect(await JsonLdHelper.getId(docWithoutId)).toBeUndefined();
	});

	test("getId accepts already expanded documents", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": ["Person"]
				},
				{
					"@id": "urn:uuid:5678",
					"@type": ["Book"]
				}
			]
		};
		const expandedDoc = await JsonLdHelper.expand(doc);

		expect(await JsonLdHelper.getId(expandedDoc)).toBe("urn:uuid:5678");
	});

	test("getPropertyValues can retrieve a full-name property from a document", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			"@type": "CreativeWork",
			description: "Example description"
		};

		expect(await JsonLdHelper.getPropertyValues(doc, ["https://example.org/description"])).toEqual([
			["Example description"]
		]);
	});

	test("getPropertyValues can retrieve a full-name property from expanded documents", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			"@type": "CreativeWork",
			description: "Expanded description"
		};
		const expandedDoc = await JsonLdHelper.expand(doc);

		expect(
			await JsonLdHelper.getPropertyValues(expandedDoc, ["https://example.org/description"])
		).toEqual([["Expanded description"]]);
	});

	test("getPropertyValues can retrieve @value from a typed value object", async () => {
		const doc: IJsonLdDocument = {
			"@context": "https://schema.org",
			description: {
				"@value": "Hello",
				"@type": "schema:Text"
			}
		};

		const value = await JsonLdHelper.getPropertyValues(doc, ["http://schema.org/description"]);
		expect(value).toEqual([["Hello"]]);
	});

	test("getPropertyValues can retrieve a value from prefixed schema property", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				schema: "https://schema.org/"
			},
			"schema:description": "Description"
		};

		const value = await JsonLdHelper.getPropertyValues(doc, ["https://schema.org/description"]);
		expect(value).toEqual([["Description"]]);
	});

	test("getPropertyValues can retrieve a value from language-tagged aliases", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				descriptionEn: "https://schema.org/description",
				descriptionEs: "https://schema.org/description"
			},
			descriptionEn: {
				"@value": "A Description",
				"@language": "EN"
			},
			descriptionEs: {
				"@value": "Una descripción",
				"@language": "ES"
			}
		};

		const value = await JsonLdHelper.getPropertyValues(doc, ["https://schema.org/description"]);
		expect(value).toEqual([["A Description", "Una descripción"]]);
	});

	test("getPropertyValues can filter values by language", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				descriptionEn: "https://schema.org/description",
				descriptionEs: "https://schema.org/description"
			},
			descriptionEn: {
				"@value": "A Description",
				"@language": "EN"
			},
			descriptionEs: {
				"@value": "Una descripción",
				"@language": "ES"
			}
		};

		expect(
			await JsonLdHelper.getPropertyValues(doc, ["https://schema.org/description"], "en")
		).toEqual([["A Description"]]);
		expect(
			await JsonLdHelper.getPropertyValues(doc, ["https://schema.org/description"], "es")
		).toEqual([["Una descripción"]]);
		expect(
			await JsonLdHelper.getPropertyValues(doc, ["https://schema.org/description"], "fr")
		).toEqual([undefined]);
	});

	test("getPropertyValues returns undefined for non-language values when language filter is set", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			description: "No language"
		};

		expect(
			await JsonLdHelper.getPropertyValues(doc, ["https://example.org/description"], "en")
		).toEqual([undefined]);
	});

	test("getPropertyValues returns undefined when full-name property does not match exactly", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			"@type": "CreativeWork",
			description: "Exact description"
		};

		expect(await JsonLdHelper.getPropertyValues(doc, ["http://example.org/description"])).toEqual([
			undefined
		]);
	});

	test("getPropertyValues returns undefined when property does not exist", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description",
				name: "https://example.org/name"
			},
			"@type": "CreativeWork",
			name: "No description"
		};

		expect(await JsonLdHelper.getPropertyValues(doc, ["https://example.org/description"])).toEqual([
			undefined
		]);
	});

	test("getPropertyValues returns index-aligned results for multiple property names", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description",
				name: "https://example.org/name"
			},
			description: "Example description",
			name: "Example name"
		};

		expect(
			await JsonLdHelper.getPropertyValues(doc, [
				"https://example.org/name",
				"https://example.org/missing",
				"https://example.org/description"
			])
		).toEqual([["Example name"], undefined, ["Example description"]]);
	});

	test("getPropertyValues throws when propertyFullNames is empty", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			description: "Example description"
		};

		await expect(JsonLdHelper.getPropertyValues(doc, [])).rejects.toMatchObject({
			source: "JsonLdHelper",
			name: "GuardError",
			message: "guard.arrayValue"
		});
	});

	test("getPropertyValues throws when propertyFullNames contains non-string entries", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			description: "Example description"
		};

		await expect(
			JsonLdHelper.getPropertyValues(doc, [
				"https://example.org/description",
				123 as unknown as string
			])
		).rejects.toMatchObject({
			source: "JsonLdHelper",
			name: "GuardError",
			message: "guard.string"
		});
	});

	test("getPropertyValues returns duplicated results for duplicated input properties", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			description: "Example description"
		};

		expect(
			await JsonLdHelper.getPropertyValues(doc, [
				"https://example.org/description",
				"https://example.org/description"
			])
		).toEqual([["Example description"], ["Example description"]]);
	});

	test("getPropertyValues supports primitive boolean and number values", async () => {
		const expandedDoc = [
			{
				"https://example.org/enabled": [
					{
						"@value": true
					}
				],
				"https://example.org/count": [
					{
						"@value": 42
					}
				]
			}
		];

		expect(
			await JsonLdHelper.getPropertyValues(expandedDoc, [
				"https://example.org/enabled",
				"https://example.org/count"
			])
		).toEqual([[true], [42]]);
	});

	test("getPropertyValues returns object values without @value when language is not set", async () => {
		const expandedDoc = [
			{
				"https://example.org/ref": [
					{
						"@id": "urn:example:ref:1"
					}
				]
			}
		];

		expect(await JsonLdHelper.getPropertyValues(expandedDoc, ["https://example.org/ref"])).toEqual([
			[{ "@id": "urn:example:ref:1" }]
		]);
	});

	test("getPropertyValues excludes object values without @value when language is set", async () => {
		const expandedDoc = [
			{
				"https://example.org/ref": [
					{
						"@id": "urn:example:ref:1"
					}
				]
			}
		];

		expect(
			await JsonLdHelper.getPropertyValues(expandedDoc, ["https://example.org/ref"], "en")
		).toEqual([undefined]);
	});

	test("getPropertyValues keeps index alignment with language filtering across properties", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				descriptionEn: "https://schema.org/description",
				descriptionEs: "https://schema.org/description",
				headline: "https://schema.org/headline"
			},
			descriptionEn: {
				"@value": "A Description",
				"@language": "EN"
			},
			descriptionEs: {
				"@value": "Una descripción",
				"@language": "ES"
			},
			headline: "No language"
		};

		expect(
			await JsonLdHelper.getPropertyValues(
				doc,
				[
					"https://schema.org/description",
					"https://schema.org/headline",
					"https://schema.org/missing"
				],
				"es"
			)
		).toEqual([["Una descripción"], undefined, undefined]);
	});

	test("getPropertyValue wraps getPropertyValues for single property", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				description: "https://example.org/description"
			},
			description: "Example description"
		};

		expect(await JsonLdHelper.getPropertyValue(doc, "https://example.org/description")).toEqual([
			"Example description"
		]);
		expect(await JsonLdHelper.getPropertyValue(doc, "https://example.org/missing")).toBeUndefined();
		expect(
			await JsonLdHelper.getPropertyValue(doc, "https://example.org/description", "en")
		).toBeUndefined();
	});

	test("getPropertyValue supports language filtering", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				descriptionEn: "https://schema.org/description",
				descriptionEs: "https://schema.org/description"
			},
			descriptionEn: {
				"@value": "A Description",
				"@language": "EN"
			},
			descriptionEs: {
				"@value": "Una descripción",
				"@language": "ES"
			}
		};

		expect(
			await JsonLdHelper.getPropertyValue(doc, "https://schema.org/description", "en")
		).toEqual(["A Description"]);
		expect(
			await JsonLdHelper.getPropertyValue(doc, "https://schema.org/description", "es")
		).toEqual(["Una descripción"]);
	});

	test("getPropertyValue returns all multi-language values when language is not provided", async () => {
		const doc: IJsonLdDocument = {
			"@context": {
				descriptionEn: "https://schema.org/description",
				descriptionEs: "https://schema.org/description"
			},
			descriptionEn: {
				"@value": "A Description",
				"@language": "EN"
			},
			descriptionEs: {
				"@value": "Una descripción",
				"@language": "ES"
			}
		};

		expect(await JsonLdHelper.getPropertyValue(doc, "https://schema.org/description")).toEqual([
			"A Description",
			"Una descripción"
		]);
	});
});
