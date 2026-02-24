# Type Alias: JsonLdObjectWithId\<T, Id\>

> **JsonLdObjectWithId**\<`T`, `Id`\> = `Omit`\<`T`, `"@id"`\> & `object`

Add "@id" to a type.

## Type Declaration

### @id

> **@id**: `Id`

## Type Parameters

### T

`T` *extends* `object`

### Id

`Id` = [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `"@id"`, `string`\>
