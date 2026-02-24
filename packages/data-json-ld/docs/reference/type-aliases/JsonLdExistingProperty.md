# Type Alias: JsonLdExistingProperty\<T, P, D\>

> **JsonLdExistingProperty**\<`T`, `P`, `D`\> = `T` *extends* `{ [K in P]?: infer PropertyType }` ? `Exclude`\<`PropertyType`, `undefined`\> : `D`

Infer an existing property's type from a source type, or fall back to a default.

## Type Parameters

### T

`T` *extends* `object`

### P

`P` *extends* `PropertyKey`

### D

`D`
