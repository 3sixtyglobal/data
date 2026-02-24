# Type Alias: JsonLdObjectWithType\<T, Ty\>

> **JsonLdObjectWithType**\<`T`, `Ty`\> = `Omit`\<`T`, `"@type"`\> & `object`

Add "@type" to a type.

## Type Declaration

### @type

> **@type**: `Ty`

## Type Parameters

### T

`T` *extends* `object`

### Ty

`Ty` = [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `"@type"`, `string` \| `string`[]\>
