# Interface: IJsonLdGraphObject

A graph object represents a named graph, which MAY include an explicit graph name.

## See

https://www.w3.org/TR/json-ld11/#graph-objects

## Properties

### @graph {#graph}

> **@graph**: [`IJsonLdNodeObject`](IJsonLdNodeObject.md) \| [`IJsonLdNodeObject`](IJsonLdNodeObject.md)[]

***

### @index? {#index}

> `optional` **@index?**: `string`

***

### @id? {#id}

> `optional` **@id?**: `string` \| `string`[]

***

### @context? {#context}

> `optional` **@context?**: [`IJsonLdContextDefinitionRoot`](../type-aliases/IJsonLdContextDefinitionRoot.md)
