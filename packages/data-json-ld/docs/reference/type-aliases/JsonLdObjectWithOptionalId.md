# Type Alias: JsonLdObjectWithOptionalId\<T, Id\>

> **JsonLdObjectWithOptionalId**\<`T`, `Id`\> = `Omit`\<`T`, `"id"` \| `"@id"`\> & `object`

Add optional "id" to a type.

## Type Parameters

### T {#t}

`T` *extends* `object`

### Id {#id}

`Id` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"id"`, `"@id"`, `string`\>

## Type Declaration

### id?

> `optional` **id?**: `Id`
