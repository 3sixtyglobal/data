# Type Alias: JsonLdObjectWithAliases\<T, Prefix\>

> **JsonLdObjectWithAliases**\<`T`, `Prefix`\> = [`JsonLdKeys`](JsonLdKeys.md)\<`T`\> & [`JsonLdWithAliases`](JsonLdWithAliases.md)\<`T`, `Prefix`\>

Create a JSON-LD object shape containing only JSON-LD keys plus aliased
non-JSON-LD keys.

## Type Parameters

### T {#t}

`T` *extends* `object`

### Prefix {#prefix}

`Prefix` *extends* `string`
