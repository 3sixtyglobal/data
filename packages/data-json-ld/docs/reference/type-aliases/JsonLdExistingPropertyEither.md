# Type Alias: JsonLdExistingPropertyEither\<T, P1, P2, D\>

> **JsonLdExistingPropertyEither**\<`T`, `P1`, `P2`, `D`\> = \[[`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `P1`, `never`\> \| [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `P2`, `never`\>\] *extends* \[`never`\] ? `D` : [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `P1`, `never`\> \| [`JsonLdExistingProperty`](JsonLdExistingProperty.md)\<`T`, `P2`, `never`\>

Infer an existing property's type from either of two source properties,
or fall back to a default when neither exists.

## Type Parameters

### T

`T` *extends* `object`

### P1

`P1` *extends* `PropertyKey`

### P2

`P2` *extends* `PropertyKey`

### D

`D`
