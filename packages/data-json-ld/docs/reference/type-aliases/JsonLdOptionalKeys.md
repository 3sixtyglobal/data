# Type Alias: JsonLdOptionalKeys\<T\>

> **JsonLdOptionalKeys**\<`T`\> = `{ [K in keyof T]-?: {} extends Pick<T, K> ? K : never }`\[keyof `T`\]

Extract the optional property names from a type.

## Type Parameters

### T

`T`
