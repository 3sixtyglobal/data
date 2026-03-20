# Interface: IJsonLdObject

An object represents the pre-defined properties of the node object
in the graph serialized by the JSON-LD document.

## See

https://www.w3.org/TR/json-ld11/#node-objects

## Extended by

- [`IJsonLdNodeObject`](IJsonLdNodeObject.md)

## Properties

### @context? {#context}

> `optional` **@context?**: [`IJsonLdContextDefinitionRoot`](../type-aliases/IJsonLdContextDefinitionRoot.md)

***

### @id? {#id}

> `optional` **@id?**: `string` \| `string`[]

***

### @included? {#included}

> `optional` **@included?**: [`IJsonLdIncludedBlock`](../type-aliases/IJsonLdIncludedBlock.md)

***

### @graph? {#graph}

> `optional` **@graph?**: [`IJsonLdNodeObject`](IJsonLdNodeObject.md) \| [`IJsonLdNodeObject`](IJsonLdNodeObject.md)[]

***

### @nest? {#nest}

> `optional` **@nest?**: [`IJsonLdJsonObject`](IJsonLdJsonObject.md) \| [`IJsonLdJsonObject`](IJsonLdJsonObject.md)[]

***

### @type? {#type}

> `optional` **@type?**: `string` \| `string`[]

***

### @reverse? {#reverse}

> `optional` **@reverse?**: `object`

#### Index Signature

\[`key`: `string`\]: `string`

***

### @index? {#index}

> `optional` **@index?**: `string`
