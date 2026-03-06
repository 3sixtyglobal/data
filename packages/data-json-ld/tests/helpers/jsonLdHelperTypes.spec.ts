// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	JsonLdKeys,
	JsonLdObjectWithAtId,
	JsonLdObjectWithAtType,
	JsonLdObjectWithNoContext,
	JsonLdObjectWithNoAtId,
	JsonLdObjectWithNoAtType,
	JsonLdObjectWithNoId,
	JsonLdObjectWithNoType,
	JsonLdObjectWithAliases,
	JsonLdObjectWithContext,
	JsonLdObjectWithId,
	JsonLdObjectWithOptionalAtId,
	JsonLdObjectWithOptionalAtType,
	JsonLdObjectWithOptionalContext,
	JsonLdObjectWithOptionalId,
	JsonLdObjectWithOptionalType,
	JsonLdObjectWithType,
	JsonLdWithAliases
} from "../../src/helpers/jsonLdHelperTypes.js";

interface ITestJsonLdShape {
	"@id": string;
	"@type": string;
	"@context"?: string;
	name: string;
	count: number;
}

describe("JsonLdHelperTypes", () => {
	test("can preserve required and optional JSON-LD key optionality", () => {
		// @ts-expect-error Intentionally omitting required "@type" to prove type enforcement.
		const missingType: JsonLdWithAliases<ITestJsonLdShape, "ex"> = {
			"@id": "did:example:missing-type",
			"ex:name": "MissingType",
			"ex:count": 0
		};

		const aliases: JsonLdWithAliases<ITestJsonLdShape, "ex"> = {
			"@id": "did:example:alice",
			"@type": "Person",
			"ex:name": "Alice",
			"ex:count": 3
		};

		const withOptionalContext: JsonLdWithAliases<ITestJsonLdShape, "ex"> = {
			"@id": "did:example:bob",
			"@type": "Person",
			"@context": "https://schema.org",
			"ex:name": "Bob",
			"ex:count": 4
		};

		expect(Object.keys(aliases).sort()).toEqual(["@id", "@type", "ex:count", "ex:name"]);
		expect(aliases["@id"]).toBe("did:example:alice");
		expect(aliases["@type"]).toBe("Person");
		expect(aliases["@context"]).toBeUndefined();
		expect(aliases["ex:name"]).toBe("Alice");
		expect(aliases["ex:count"]).toBe(3);
		expect(missingType["@type"]).toBeUndefined();
		expect(withOptionalContext["@context"]).toBe("https://schema.org");
	});

	test("can preserve JSON-LD keys and create aliases for non JSON-LD keys", () => {
		const aliases: JsonLdWithAliases<ITestJsonLdShape, "ex"> = {
			"@id": "did:example:alice",
			"@type": "Person",
			"ex:name": "Alice",
			"ex:count": 3
		};

		expect(Object.keys(aliases).sort()).toEqual(["@id", "@type", "ex:count", "ex:name"]);
		expect(aliases["@id"]).toBe("did:example:alice");
		expect(aliases["@type"]).toBe("Person");
		expect(aliases["ex:name"]).toBe("Alice");
		expect(aliases["ex:count"]).toBe(3);
	});

	test("can keep only JSON-LD keys from a type", () => {
		const jsonLdKeys: JsonLdKeys<ITestJsonLdShape> = {
			"@id": "did:example:123",
			"@type": "ExampleType",
			"@context": "https://schema.org"
		};

		expect(Object.keys(jsonLdKeys).sort()).toEqual(["@context", "@id", "@type"]);
		expect(jsonLdKeys["@id"]).toBe("did:example:123");
		expect(jsonLdKeys["@type"]).toBe("ExampleType");
	});

	test("can combine JSON-LD keys with prefixed aliases", () => {
		const aliasedObject: JsonLdObjectWithAliases<ITestJsonLdShape, "ex"> = {
			"@id": "did:example:999",
			"@type": "AliasedExample",
			"ex:name": "Bob",
			"ex:count": 10
		};

		expect(Object.keys(aliasedObject).sort()).toEqual(["@id", "@type", "ex:count", "ex:name"]);
		expect(aliasedObject["@id"]).toBe("did:example:999");
		expect(aliasedObject["ex:name"]).toBe("Bob");
	});

	test("can add @context to a type", () => {
		const withContext: JsonLdObjectWithContext<{ name: string; count: number }> = {
			name: "Carol",
			count: 1,
			"@context": "https://schema.org"
		};

		expect(withContext["@context"]).toBe("https://schema.org");
		expect(withContext.name).toBe("Carol");
	});

	test("can add optional @context to a type", () => {
		const withoutContext: JsonLdObjectWithOptionalContext<{ name: string; count: number }> = {
			name: "NoContext",
			count: 2
		};

		const withOptionalContext: JsonLdObjectWithOptionalContext<{ name: string; count: number }> = {
			name: "WithContext",
			count: 3,
			"@context": "https://schema.org"
		};

		expect(withoutContext["@context"]).toBeUndefined();
		expect(withOptionalContext["@context"]).toBe("https://schema.org");
		expect(withoutContext.name).toBe("NoContext");
		expect(withOptionalContext.name).toBe("WithContext");
	});

	test("can use custom context type parameter", () => {
		interface TCustomContext {
			custom: string;
		}

		const requiredCustomContext: JsonLdObjectWithContext<{ name: string }, TCustomContext> = {
			name: "CustomRequired",
			"@context": {
				custom: "value"
			}
		};

		const optionalCustomContext: JsonLdObjectWithOptionalContext<{ name: string }, TCustomContext> =
			{
				name: "CustomOptional"
			};

		expect(requiredCustomContext["@context"]).toEqual({ custom: "value" });
		expect(optionalCustomContext["@context"]).toBeUndefined();
	});

	test("can replace existing @context from source type", () => {
		interface TSourceWithContext {
			name: string;
			"@context": number;
		}

		interface TContextReplacement {
			custom: string;
		}

		const replacedRequired: JsonLdObjectWithContext<TSourceWithContext, TContextReplacement> = {
			name: "ReplacedRequired",
			"@context": { custom: "ctx" }
		};

		const replacedOptional: JsonLdObjectWithOptionalContext<
			TSourceWithContext,
			TContextReplacement
		> = {
			name: "ReplacedOptional"
		};

		expect(replacedRequired["@context"]).toEqual({ custom: "ctx" });
		expect(replacedOptional["@context"]).toBeUndefined();
	});

	test("can infer existing @context type for optional helper", () => {
		interface TSourceWithContext {
			name: string;
			"@context": number;
		}

		const inferredOptionalWithoutContext: JsonLdObjectWithOptionalContext<TSourceWithContext> = {
			name: "InferredNoContext"
		};

		const inferredOptionalWithContext: JsonLdObjectWithOptionalContext<TSourceWithContext> = {
			name: "InferredWithContext",
			"@context": 42
		};

		expect(inferredOptionalWithoutContext["@context"]).toBeUndefined();
		expect(inferredOptionalWithContext["@context"]).toBe(42);
	});

	test("can override inferred @context type with explicit generic", () => {
		interface TSourceWithContext {
			name: string;
			"@context": number;
		}

		const explicitContext: JsonLdObjectWithOptionalContext<TSourceWithContext, string> = {
			name: "ExplicitContext",
			"@context": "https://schema.org"
		};

		const invalidExplicitContext: JsonLdObjectWithOptionalContext<TSourceWithContext, string> = {
			name: "InvalidExplicitContext",
			// @ts-expect-error Explicit generic should override inferred number context.
			"@context": 99
		};

		expect(explicitContext["@context"]).toBe("https://schema.org");
		expect(invalidExplicitContext["@context"]).toBe(99);
	});

	test("can infer @context from optional source property type", () => {
		interface TSourceWithOptionalContext {
			name: string;
			"@context"?: number;
		}

		const inferredOptional: JsonLdObjectWithOptionalContext<TSourceWithOptionalContext> = {
			name: "InferredOptionalContext",
			"@context": 5
		};

		const invalidInferredOptional: JsonLdObjectWithOptionalContext<TSourceWithOptionalContext> = {
			name: "InvalidInferredOptionalContext",
			// @ts-expect-error Inferred context type should be number.
			"@context": "not-a-number"
		};

		expect(inferredOptional["@context"]).toBe(5);
		expect(invalidInferredOptional["@context"]).toBe("not-a-number");
	});

	test("can omit @context from a type", () => {
		interface TSourceWithContext {
			name: string;
			"@context": number;
		}

		const withoutContext: JsonLdObjectWithNoContext<TSourceWithContext> = {
			name: "NoContext"
		};

		expect(withoutContext.name).toBe("NoContext");
		expect((withoutContext as { "@context"?: unknown })["@context"]).toBeUndefined();
	});

	test("can add @type to a type", () => {
		const withTypeSingle: JsonLdObjectWithAtType<{ name: string }> = {
			name: "SingleType",
			"@type": "ExampleType"
		};

		const withTypeArray: JsonLdObjectWithAtType<{ name: string }> = {
			name: "MultiType",
			"@type": ["TypeOne", "TypeTwo"]
		};

		expect(withTypeSingle["@type"]).toBe("ExampleType");
		expect(withTypeArray["@type"]).toEqual(["TypeOne", "TypeTwo"]);
	});

	test("can add optional @type to a type", () => {
		const withoutType: JsonLdObjectWithOptionalAtType<{ name: string }> = {
			name: "NoType"
		};

		const withOptionalType: JsonLdObjectWithOptionalAtType<{ name: string }> = {
			name: "WithType",
			"@type": "OptionalType"
		};

		expect(withoutType["@type"]).toBeUndefined();
		expect(withOptionalType["@type"]).toBe("OptionalType");
	});

	test("can use custom @type type parameter", () => {
		interface TTypeReplacement {
			value: string;
		}

		const customType: JsonLdObjectWithAtType<{ name: string }, TTypeReplacement> = {
			name: "CustomType",
			"@type": {
				value: "custom"
			}
		};

		expect(customType["@type"]).toEqual({ value: "custom" });
	});

	test("can replace existing @type from source type", () => {
		interface TSourceWithType {
			name: string;
			"@type": number;
		}

		interface TTypeReplacement {
			value: string;
		}

		const replacedRequired: JsonLdObjectWithAtType<TSourceWithType, TTypeReplacement> = {
			name: "ReplacedRequiredType",
			"@type": { value: "replacement" }
		};

		const replacedOptional: JsonLdObjectWithOptionalAtType<TSourceWithType, TTypeReplacement> = {
			name: "ReplacedOptionalType"
		};

		expect(replacedRequired["@type"]).toEqual({ value: "replacement" });
		expect(replacedOptional["@type"]).toBeUndefined();
	});

	test("can infer existing @type type for helpers", () => {
		interface TSourceWithType {
			name: string;
			"@type": number;
		}

		const inferredRequired: JsonLdObjectWithAtType<TSourceWithType> = {
			name: "InferredRequiredType",
			"@type": 10
		};

		const inferredOptionalWithoutType: JsonLdObjectWithOptionalAtType<TSourceWithType> = {
			name: "InferredOptionalType"
		};

		const inferredOptionalWithType: JsonLdObjectWithOptionalAtType<TSourceWithType> = {
			name: "InferredOptionalTypeWithValue",
			"@type": 11
		};

		expect(inferredRequired["@type"]).toBe(10);
		expect(inferredOptionalWithoutType["@type"]).toBeUndefined();
		expect(inferredOptionalWithType["@type"]).toBe(11);
	});

	test("can override inferred @type with explicit generic", () => {
		interface TSourceWithType {
			name: string;
			"@type": number;
		}

		const explicitType: JsonLdObjectWithAtType<TSourceWithType, string> = {
			name: "ExplicitType",
			"@type": "CustomType"
		};

		const invalidExplicitType: JsonLdObjectWithAtType<TSourceWithType, string> = {
			name: "InvalidExplicitType",
			// @ts-expect-error Explicit generic should override inferred number type.
			"@type": 12
		};

		expect(explicitType["@type"]).toBe("CustomType");
		expect(invalidExplicitType["@type"]).toBe(12);
	});

	test("can exclude undefined when inferring @type from optional source property", () => {
		interface TSourceWithOptionalType {
			name: string;
			"@type"?: number;
		}

		const inferredRequired: JsonLdObjectWithAtType<TSourceWithOptionalType> = {
			name: "InferredRequiredTypeFromOptional",
			"@type": 13
		};

		const invalidInferredRequired: JsonLdObjectWithAtType<TSourceWithOptionalType> = {
			name: "InvalidInferredRequiredTypeFromOptional",
			// @ts-expect-error Inferred type excludes undefined.
			"@type": undefined
		};

		expect(inferredRequired["@type"]).toBe(13);
		expect(invalidInferredRequired["@type"]).toBeUndefined();
	});

	test("can omit @type from a type", () => {
		interface TSourceWithType {
			name: string;
			"@type": number;
		}

		const withoutType: JsonLdObjectWithNoAtType<TSourceWithType> = {
			name: "NoType"
		};

		expect(withoutType.name).toBe("NoType");
		expect((withoutType as { "@type"?: unknown })["@type"]).toBeUndefined();
	});

	test("can add @id to a type", () => {
		const withId: JsonLdObjectWithAtId<{ name: string }> = {
			name: "WithId",
			"@id": "did:example:id-only"
		};

		expect(withId["@id"]).toBe("did:example:id-only");
		expect(withId.name).toBe("WithId");
	});

	test("can add optional @id to a type", () => {
		const withoutId: JsonLdObjectWithOptionalAtId<{ name: string }> = {
			name: "NoId"
		};

		const withOptionalId: JsonLdObjectWithOptionalAtId<{ name: string }> = {
			name: "WithOptionalId",
			"@id": "did:example:optional"
		};

		expect(withoutId["@id"]).toBeUndefined();
		expect(withOptionalId["@id"]).toBe("did:example:optional");
	});

	test("can use custom @id type parameter", () => {
		interface TIdReplacement {
			id: string;
		}

		const customId: JsonLdObjectWithAtId<{ name: string }, TIdReplacement> = {
			name: "CustomId",
			"@id": {
				id: "custom"
			}
		};

		expect(customId["@id"]).toEqual({ id: "custom" });
	});

	test("can replace existing @id from source type", () => {
		interface TSourceWithId {
			name: string;
			"@id": number;
		}

		interface TIdReplacement {
			id: string;
		}

		const replacedRequired: JsonLdObjectWithAtId<TSourceWithId, TIdReplacement> = {
			name: "ReplacedRequiredId",
			"@id": { id: "replacement" }
		};

		const replacedOptional: JsonLdObjectWithOptionalAtId<TSourceWithId, TIdReplacement> = {
			name: "ReplacedOptionalId"
		};

		expect(replacedRequired["@id"]).toEqual({ id: "replacement" });
		expect(replacedOptional["@id"]).toBeUndefined();
	});

	test("can infer existing @id type for helpers", () => {
		interface TSourceWithId {
			name: string;
			"@id": number;
		}

		const inferredRequired: JsonLdObjectWithAtId<TSourceWithId> = {
			name: "InferredRequiredId",
			"@id": 20
		};

		const inferredOptionalWithoutId: JsonLdObjectWithOptionalAtId<TSourceWithId> = {
			name: "InferredOptionalId"
		};

		const inferredOptionalWithId: JsonLdObjectWithOptionalAtId<TSourceWithId> = {
			name: "InferredOptionalIdWithValue",
			"@id": 21
		};

		expect(inferredRequired["@id"]).toBe(20);
		expect(inferredOptionalWithoutId["@id"]).toBeUndefined();
		expect(inferredOptionalWithId["@id"]).toBe(21);
	});

	test("can override inferred @id with explicit generic", () => {
		interface TSourceWithId {
			name: string;
			"@id": number;
		}

		const explicitId: JsonLdObjectWithAtId<TSourceWithId, string> = {
			name: "ExplicitId",
			"@id": "did:example:explicit"
		};

		const invalidExplicitId: JsonLdObjectWithAtId<TSourceWithId, string> = {
			name: "InvalidExplicitId",
			// @ts-expect-error Explicit generic should override inferred number id.
			"@id": 22
		};

		expect(explicitId["@id"]).toBe("did:example:explicit");
		expect(invalidExplicitId["@id"]).toBe(22);
	});

	test("can exclude undefined when inferring @id from optional source property", () => {
		interface TSourceWithOptionalId {
			name: string;
			"@id"?: number;
		}

		const inferredRequired: JsonLdObjectWithAtId<TSourceWithOptionalId> = {
			name: "InferredRequiredIdFromOptional",
			"@id": 23
		};

		const invalidInferredRequired: JsonLdObjectWithAtId<TSourceWithOptionalId> = {
			name: "InvalidInferredRequiredIdFromOptional",
			// @ts-expect-error Inferred id type excludes undefined.
			"@id": undefined
		};

		expect(inferredRequired["@id"]).toBe(23);
		expect(invalidInferredRequired["@id"]).toBeUndefined();
	});

	test("can omit @id from a type", () => {
		interface TSourceWithId {
			name: string;
			"@id": number;
		}

		const withoutId: JsonLdObjectWithNoAtId<TSourceWithId> = {
			name: "NoId"
		};

		expect(withoutId.name).toBe("NoId");
		expect((withoutId as { "@id"?: unknown })["@id"]).toBeUndefined();
	});

	test("can add and infer plain type keys", () => {
		interface TSourceWithType {
			name: string;
			type: number;
		}

		const plainType: JsonLdObjectWithType<{ name: string }> = {
			name: "PlainType",
			type: "ExampleType"
		};

		const inferredType: JsonLdObjectWithType<TSourceWithType> = {
			name: "InferredPlainType",
			type: 7
		};

		expect(plainType.type).toBe("ExampleType");
		expect(inferredType.type).toBe(7);
	});

	test("can add optional and omit plain type keys", () => {
		interface TSourceWithType {
			name: string;
			type: number;
		}

		const withoutType: JsonLdObjectWithOptionalType<{ name: string }> = {
			name: "NoPlainType"
		};

		const withOptionalType: JsonLdObjectWithOptionalType<{ name: string }> = {
			name: "WithPlainType",
			type: "OptionalType"
		};

		const omittedType: JsonLdObjectWithNoType<TSourceWithType> = {
			name: "OmittedPlainType"
		};

		expect(withoutType.type).toBeUndefined();
		expect(withOptionalType.type).toBe("OptionalType");
		expect((omittedType as { type?: unknown }).type).toBeUndefined();
	});

	test("can add and infer plain id keys", () => {
		interface TSourceWithId {
			name: string;
			id: number;
		}

		const plainId: JsonLdObjectWithId<{ name: string }> = {
			name: "PlainId",
			id: "did:example:plain"
		};

		const inferredId: JsonLdObjectWithId<TSourceWithId> = {
			name: "InferredPlainId",
			id: 8
		};

		expect(plainId.id).toBe("did:example:plain");
		expect(inferredId.id).toBe(8);
	});

	test("can add optional and omit plain id keys", () => {
		interface TSourceWithId {
			name: string;
			id: number;
		}

		const withoutId: JsonLdObjectWithOptionalId<{ name: string }> = {
			name: "NoPlainId"
		};

		const withOptionalId: JsonLdObjectWithOptionalId<{ name: string }> = {
			name: "WithPlainId",
			id: "did:example:optional-plain"
		};

		const omittedId: JsonLdObjectWithNoId<TSourceWithId> = {
			name: "OmittedPlainId"
		};

		expect(withoutId.id).toBeUndefined();
		expect(withOptionalId.id).toBe("did:example:optional-plain");
		expect((omittedId as { id?: unknown }).id).toBeUndefined();
	});

	test("can infer plain type from @type and remove both source variants", () => {
		interface TSourceWithAtType {
			name: string;
			"@type": number;
		}

		const inferredFromAtType: JsonLdObjectWithType<TSourceWithAtType> = {
			name: "InferredFromAtType",
			type: 14
		};

		expect(inferredFromAtType.type).toBe(14);
		expect((inferredFromAtType as { "@type"?: unknown })["@type"]).toBeUndefined();
	});

	test("can infer @type from plain type and remove both source variants", () => {
		interface TSourceWithType {
			name: string;
			type: number;
		}

		const inferredFromType: JsonLdObjectWithAtType<TSourceWithType> = {
			name: "InferredFromType",
			"@type": 16
		};

		expect(inferredFromType["@type"]).toBe(16);
		expect((inferredFromType as { type?: unknown }).type).toBeUndefined();
	});

	test("can infer plain id from @id and remove both source variants", () => {
		interface TSourceWithAtId {
			name: string;
			"@id": number;
		}

		const inferredFromAtId: JsonLdObjectWithId<TSourceWithAtId> = {
			name: "InferredFromAtId",
			id: 24
		};

		expect(inferredFromAtId.id).toBe(24);
		expect((inferredFromAtId as { "@id"?: unknown })["@id"]).toBeUndefined();
	});

	test("can infer @id from plain id and remove both source variants", () => {
		interface TSourceWithId {
			name: string;
			id: number;
		}

		const inferredFromId: JsonLdObjectWithAtId<TSourceWithId> = {
			name: "InferredFromId",
			"@id": 25
		};

		expect(inferredFromId["@id"]).toBe(25);
		expect((inferredFromId as { id?: unknown }).id).toBeUndefined();
	});

	test("can infer union when both plain and @ variants exist", () => {
		interface TSourceWithBothTypeKeys {
			name: string;
			type: number;
			"@type": string;
		}

		interface TSourceWithBothIdKeys {
			name: string;
			id: number;
			"@id": string;
		}

		const typeFromBothAsNumber: JsonLdObjectWithType<TSourceWithBothTypeKeys> = {
			name: "TypeFromBothAsNumber",
			type: 26
		};

		const typeFromBothAsString: JsonLdObjectWithType<TSourceWithBothTypeKeys> = {
			name: "TypeFromBothAsString",
			type: "TwentySix"
		};

		const idFromBothAsNumber: JsonLdObjectWithAtId<TSourceWithBothIdKeys> = {
			name: "IdFromBothAsNumber",
			"@id": 27
		};

		const idFromBothAsString: JsonLdObjectWithAtId<TSourceWithBothIdKeys> = {
			name: "IdFromBothAsString",
			"@id": "did:example:twenty-seven"
		};

		expect(typeFromBothAsNumber.type).toBe(26);
		expect(typeFromBothAsString.type).toBe("TwentySix");
		expect(idFromBothAsNumber["@id"]).toBe(27);
		expect(idFromBothAsString["@id"]).toBe("did:example:twenty-seven");
	});

	test("can use fallback defaults when source has no JSON-LD keys", () => {
		const defaultContext: JsonLdObjectWithOptionalContext<{ name: string }> = {
			name: "DefaultContext",
			"@context": "https://schema.org"
		};

		const defaultType: JsonLdObjectWithAtType<{ name: string }> = {
			name: "DefaultType",
			"@type": ["TypeOne", "TypeTwo"]
		};

		const defaultId: JsonLdObjectWithAtId<{ name: string }> = {
			name: "DefaultId",
			"@id": "did:example:default"
		};

		expect(defaultContext["@context"]).toBe("https://schema.org");
		expect(defaultType["@type"]).toEqual(["TypeOne", "TypeTwo"]);
		expect(defaultId["@id"]).toBe("did:example:default");
	});
});
