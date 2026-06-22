# Type Alias: JsonLdObjectWithOptionalAtType\<T, Ty\>

> **JsonLdObjectWithOptionalAtType**\<`T`, `Ty`\> = `Omit`\<`T`, `"@type"` \| `"type"`\> & `object`

Add optional "@type" to a type.

## Type Declaration

### @type?

> `optional` **@type?**: `Ty`

## Type Parameters

### T

`T` *extends* `object`

### Ty

`Ty` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"@type"`, `"type"`, `string` \| `string`[]\>
