# Type Alias: JsonLdObjectWithType\<T, Ty\>

> **JsonLdObjectWithType**\<`T`, `Ty`\> = `Omit`\<`T`, `"type"` \| `"@type"`\> & `object`

Add "type" to a type.

## Type Parameters

### T {#t}

`T` *extends* `object`

### Ty {#ty}

`Ty` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"type"`, `"@type"`, `string` \| `string`[]\>

## Type Declaration

### type

> **type**: `Ty`
