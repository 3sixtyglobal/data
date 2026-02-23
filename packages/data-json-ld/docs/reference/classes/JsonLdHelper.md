# Class: JsonLdHelper

Class to help with JSON LD.

## Constructors

### Constructor

> **new JsonLdHelper**(): `JsonLdHelper`

#### Returns

`JsonLdHelper`

## Methods

### validate()

> `static` **validate**\<`T`\>(`document`, `validationFailures`, `options?`): `Promise`\<`boolean`\>

Validate a JSON-LD document.

#### Type Parameters

##### T

`T` *extends* [`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md) = [`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

#### Parameters

##### document

`T`

The JSON-LD document to validate.

##### validationFailures

`IValidationFailure`[]

The list of validation failures to add to.

##### options?

Optional options for validation.

###### validationMode?

`ValidationMode`

The validation mode to use, defaults to either.

###### failOnMissingType?

`boolean`

If true, will fail validation if the data type is missing, defaults to false.

#### Returns

`Promise`\<`boolean`\>

True if the document was valid.

***

### toNodeObject()

> `static` **toNodeObject**\<`T`\>(`object`): `T` & [`IJsonLdNodeObject`](../interfaces/IJsonLdNodeObject.md)

Expand an object to a JSON-LD node object.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### object

`T`

The object to expand.

#### Returns

`T` & [`IJsonLdNodeObject`](../interfaces/IJsonLdNodeObject.md)

The expanded JSON-LD node object.

***

### expand()

> `static` **expand**(`document`): `Promise`\<[`IJsonLdNodeObject`](../interfaces/IJsonLdNodeObject.md)[]\>

Expand the JSON-LD document.

#### Parameters

##### document

[`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

The JSON-LD document to expand.

#### Returns

`Promise`\<[`IJsonLdNodeObject`](../interfaces/IJsonLdNodeObject.md)[]\>

The expanded JSON-LD document.

***

### isType()

> `static` **isType**(`documentOrExpanded`, `type`): `Promise`\<`boolean`\>

Expand the JSON-LD document and check if it is of a specific type.

#### Parameters

##### documentOrExpanded

[`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

The JSON-LD document to check or already expanded document.

##### type

`string`[]

The type to check for.

#### Returns

`Promise`\<`boolean`\>

True if the document is of the specified type.

***

### getType()

> `static` **getType**(`documentOrExpanded`): `Promise`\<`string`[]\>

Get the types from the document.

#### Parameters

##### documentOrExpanded

[`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

The JSON-LD document to check or already expanded document.

#### Returns

`Promise`\<`string`[]\>

The type(s) extracted from the document.

***

### getId()

> `static` **getId**(`documentOrExpanded`): `Promise`\<`string` \| `undefined`\>

Get the id from the document.

#### Parameters

##### documentOrExpanded

[`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

The JSON-LD document to get the id from or already expanded document.

#### Returns

`Promise`\<`string` \| `undefined`\>

The id extracted from the document.

***

### getPropertyValue()

> `static` **getPropertyValue**(`documentOrExpanded`, `propertyFullName`, `language?`): `Promise`\<[`IJsonLdNodePrimitive`](../type-aliases/IJsonLdNodePrimitive.md)[] \| `undefined`\>

Get property values by a single full expanded property name.

#### Parameters

##### documentOrExpanded

[`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

The JSON-LD document to get the property from or already expanded document.

##### propertyFullName

`string`

The full expanded property name.

##### language?

`string`

Optional filter values by their language property.

#### Returns

`Promise`\<[`IJsonLdNodePrimitive`](../type-aliases/IJsonLdNodePrimitive.md)[] \| `undefined`\>

Matching property values for the input property.

***

### getPropertyValues()

> `static` **getPropertyValues**(`documentOrExpanded`, `propertyFullNames`, `language?`): `Promise`\<([`IJsonLdNodePrimitive`](../type-aliases/IJsonLdNodePrimitive.md)[] \| `undefined`)[]\>

Get property values by their full expanded property names.

#### Parameters

##### documentOrExpanded

[`IJsonLdDocument`](../type-aliases/IJsonLdDocument.md)

The JSON-LD document to get the property from or already expanded document.

##### propertyFullNames

`string`[]

The full expanded property names.

##### language?

`string`

Optional filter values by their language property.

#### Returns

`Promise`\<([`IJsonLdNodePrimitive`](../type-aliases/IJsonLdNodePrimitive.md)[] \| `undefined`)[]\>

Matching property values for each input property, in the same index order.
