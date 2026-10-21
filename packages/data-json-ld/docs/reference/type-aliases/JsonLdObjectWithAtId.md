# Type Alias: JsonLdObjectWithAtId\<T, Id\>

> **JsonLdObjectWithAtId**\<`T`, `Id`\> = `Omit`\<`T`, `"@id"` \| `"id"`\> & `object`

Add "@id" to a type.

## Type Parameters

### T {#t}

`T` *extends* `object`

### Id {#id}

`Id` = [`JsonLdExistingPropertyEither`](JsonLdExistingPropertyEither.md)\<`T`, `"@id"`, `"id"`, `string`\>

## Type Declaration

### @id

> **@id**: `Id`
