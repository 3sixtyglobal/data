# Type Alias: JsonLdObjectWithOptionalAtType\<T, Ty\>

> **JsonLdObjectWithOptionalAtType**\<`T`, `Ty`\> = `Omit`\<`T`, `"@type"` \| `"type"`\> & `object`

Add optional "@type" to a type.

## Type Parameters

### T {#t}

`T` *extends* `object`

### Ty {#ty}

`Ty` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"@type"`, `"type"`, `string` \| `string`[]\>

## Type Declaration

### @type?

> `optional` **@type?**: `Ty`
