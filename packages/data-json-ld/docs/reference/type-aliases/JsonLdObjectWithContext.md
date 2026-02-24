# Type Alias: JsonLdObjectWithContext\<T, C\>

> **JsonLdObjectWithContext**\<`T`, `C`\> = `Omit`\<`T`, `"@context"`\> & `object`

Add "@context" to a type.

## Type Declaration

### @context

> **@context**: `C`

## Type Parameters

### T

`T` *extends* `object`

### C

`C` = [`IJsonLdContextDefinitionRoot`](IJsonLdContextDefinitionRoot.md)
