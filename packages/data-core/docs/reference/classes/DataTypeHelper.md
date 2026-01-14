# Class: DataTypeHelper

Class to help with data types.

## Constructors

### Constructor

> **new DataTypeHelper**(): `DataTypeHelper`

#### Returns

`DataTypeHelper`

## Methods

### registerType()

> `static` **registerType**(`namespace`, `type`, `jsonLdContext`, `schema`): `void`

Register a data type.

#### Parameters

##### namespace

`string`

The namespace for the type.

##### type

`string`

The type for the item.

##### jsonLdContext

The JSON LD context for the type.

`string` | `undefined`

##### schema

The JSON schema for the type.

`SchemaObject` | `Promise`\<`SchemaObject`\>

#### Returns

`void`

***

### registerTypes()

> `static` **registerTypes**(`namespace`, `jsonLdContext`, `typeDefinition`): `void`

Register a  list of types.

#### Parameters

##### namespace

`string`

The namespace for the types.

##### jsonLdContext

The JSON LD context for the types.

`string` | `undefined`

##### typeDefinition

`object`[]

The type definitions to register.

#### Returns

`void`

***

### getSchemaForType()

> `static` **getSchemaForType**(`dataType`): `SchemaObject` \| `undefined`

Get the JSON schema for a data type.

#### Parameters

##### dataType

`string`

The data type to get the schema for.

#### Returns

`SchemaObject` \| `undefined`

The JSON schema for the data type or undefined if not found.

***

### validate()

> `static` **validate**(`propertyName`, `dataType`, `data`, `validationFailures`, `options?`): `Promise`\<`boolean`\>

Validate a data type.

#### Parameters

##### propertyName

`string`

The name of the property being validated to use in error messages.

##### dataType

The data type to validate.

`string` | `undefined`

##### data

`unknown`

The data to validate.

##### validationFailures

`IValidationFailure`[]

The list of validation failures to add to.

##### options?

Optional options for validation.

###### validationMode?

[`ValidationMode`](../type-aliases/ValidationMode.md)

The validation mode to use, defaults to either.

###### failOnMissingType?

`boolean`

If true, will fail validation if the data type is missing, defaults to false.

#### Returns

`Promise`\<`boolean`\>

True if the data was valid.
