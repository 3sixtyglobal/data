# Type Alias: JsonLdObjectWithType\<T, Ty\>

> **JsonLdObjectWithType**\<`T`, `Ty`\> = `Omit`\<`T`, `"type"` \| `"@type"`\> & `object`

Add "type" to a type.

## Type Declaration

### type

> **type**: `Ty`

## Type Parameters

### T

`T` *extends* `object`

### Ty

`Ty` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"type"`, `"@type"`, `string` \| `string`[]\>
