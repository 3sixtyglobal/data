# Type Alias: JsonLdAliasKey\<K, Prefix\>

> **JsonLdAliasKey**\<`K`, `Prefix`\> = `K` *extends* `` `@${string}` `` ? `K` : `` `${Prefix}:${K}` ``

Keep JSON-LD keys as-is and prefix non-JSON-LD keys.

## Type Parameters

### K

`K` *extends* `string`

### Prefix

`Prefix` *extends* `string`
