# Type Alias: JsonLdObjectWithContext\<T, C\>

> **JsonLdObjectWithContext**\<`T`, `C`\> = `Omit`\<`T`, `"@context"`\> & `object`

Add "@context" to a type.

## Type Parameters

### T {#t}

`T` *extends* `object`

### C {#c}

`C` = [`IJsonLdContextDefinitionRoot`](IJsonLdContextDefinitionRoot.md)

## Type Declaration

### @context

> **@context**: `C`
