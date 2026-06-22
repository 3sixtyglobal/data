# Interface: IJsonLdContextDefinition

A context definition defines a local context in a node object.

## See

https://www.w3.org/TR/json-ld11/#context-definitions

## Indexable

> \[`key`: `string`\]: `string` \| `boolean` \| [`IJsonLdExpandedTermDefinition`](../type-aliases/IJsonLdExpandedTermDefinition.md) \| \{ `@container`: `"@set"`; `@protected?`: `boolean`; \} \| `null` \| `undefined`

## Properties

### @base? {#base}

> `optional` **@base?**: `string` \| `null`

***

### @direction? {#direction}

> `optional` **@direction?**: `"ltr"` \| `"rtl"` \| `null`

***

### @import? {#import}

> `optional` **@import?**: `string`

***

### @language? {#language}

> `optional` **@language?**: `string`

***

### @propagate? {#propagate}

> `optional` **@propagate?**: `boolean`

***

### @protected? {#protected}

> `optional` **@protected?**: `boolean`

***

### @type? {#type}

> `optional` **@type?**: `object`

#### @container

> **@container**: `"@set"`

#### @protected?

> `optional` **@protected?**: `boolean`

***

### @version? {#version}

> `optional` **@version?**: `"1.1"`

***

### @vocab? {#vocab}

> `optional` **@vocab?**: `string` \| `null`
