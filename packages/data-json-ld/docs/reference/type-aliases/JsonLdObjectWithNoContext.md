# Type Alias: JsonLdObjectWithNoContext\<T\>

> **JsonLdObjectWithNoContext**\<`T`\> = `Omit`\<`T`, `"@context"`\>

Omit optional "@context" from a type, inferring an existing context type from
the source type when available, otherwise using the provided default.

## Type Parameters

### T

`T` *extends* `object`
