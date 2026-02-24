# Type Alias: JsonLdObjectWithOptionalType\<T, Ty\>

> **JsonLdObjectWithOptionalType**\<`T`, `Ty`\> = `Omit`\<`T`, `"@type"`\> & `object`

Add optional "@type" to a type.

## Type Declaration

### @type?

> `optional` **@type**: `Ty`

## Type Parameters

### T

`T` *extends* `object`

### Ty

`Ty` = [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `"@type"`, `string` \| `string`[]\>
