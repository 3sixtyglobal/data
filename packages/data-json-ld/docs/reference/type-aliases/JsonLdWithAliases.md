# Type Alias: JsonLdWithAliases\<T, Prefix\>

> **JsonLdWithAliases**\<`T`, `Prefix`\> = `{ [K in Extract<JsonLdRequiredKeys<T>, string> as JsonLdAliasKey<K, Prefix>]: T[K] }` & `{ [K in Extract<JsonLdOptionalKeys<T>, string> as JsonLdAliasKey<K, Prefix>]?: T[K] }`

Remap an object type so JSON-LD keys ("@...") are preserved and
non-JSON-LD keys are exposed as `Prefix:key` aliases, while preserving
each key's original required/optional status.

## Type Parameters

### T

`T` *extends* `object`

### Prefix

`Prefix` *extends* `string`
