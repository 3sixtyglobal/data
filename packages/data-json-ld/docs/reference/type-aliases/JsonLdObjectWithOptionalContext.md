# Type Alias: JsonLdObjectWithOptionalContext\<T, C\>

> **JsonLdObjectWithOptionalContext**\<`T`, `C`\> = `Omit`\<`T`, `"@context"`\> & `object`

Add optional "@context" to a type, inferring an existing context type from
the source type when available, otherwise using the provided default.

## Type Parameters

### T {#t}

`T` *extends* `object`

### C {#c}

`C` = [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `"@context"`, [`IJsonLdContextDefinitionRoot`](IJsonLdContextDefinitionRoot.md)\>

## Type Declaration

### @context?

> `optional` **@context?**: `C`
