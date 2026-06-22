# Type Alias: JsonLdObjectWithOptionalId\<T, Id\>

> **JsonLdObjectWithOptionalId**\<`T`, `Id`\> = `Omit`\<`T`, `"id"` \| `"@id"`\> & `object`

Add optional "id" to a type.

## Type Declaration

### id?

> `optional` **id?**: `Id`

## Type Parameters

### T

`T` *extends* `object`

### Id

`Id` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"id"`, `"@id"`, `string`\>
