# Class: DataTypeHelper

Class to help with data types.

## Constructors

### Constructor

> **new DataTypeHelper**(): `DataTypeHelper`

#### Returns

`DataTypeHelper`

## Methods

### registerType() {#registertype}

> `static` **registerType**(`namespace`, `type`, `jsonLdContext`, `schema`, `compiledValidator?`, `options?`): `void`

Register a data type, a type which is already registered is left unchanged so registering
dependent types more than once has no effect, unless the force option is set.

#### Parameters

##### namespace

`string`

The namespace for the type.

##### type

`string`

The type for the item.

##### jsonLdContext

`string` \| `undefined`

The JSON LD context for the type.

##### schema

`SchemaObject` \| `Promise`\<`SchemaObject`\>

The JSON schema for the type.

##### compiledValidator?

[`ICompiledValidator`](../interfaces/ICompiledValidator.md) \| `Promise`\<[`ICompiledValidator`](../interfaces/ICompiledValidator.md)\>

Optional validator compiled from the JSON schema, used in place of compiling the schema at runtime.

##### options?

Options for the registration.

###### force?

`boolean`

Replace the type if it is already registered, defaults to false.

#### Returns

`void`

***

### registerTypes() {#registertypes}

> `static` **registerTypes**(`namespace`, `jsonLdContext`, `typeDefinition`, `options?`): `void`

Register a list of types, types which are already registered are left unchanged unless the
force option is set.

#### Parameters

##### namespace

`string`

The namespace for the types.

##### jsonLdContext

`string` \| `undefined`

The JSON LD context for the types.

##### typeDefinition

`object`[]

The type definitions to register.

##### options?

Options for the registration.

###### force?

`boolean`

Replace the types which are already registered, defaults to false.

#### Returns

`void`

***

### unregisterType() {#unregistertype}

> `static` **unregisterType**(`namespace`, `type`): `void`

Unregister a data type, so it can be registered again with a different definition.

#### Parameters

##### namespace

`string`

The namespace for the type.

##### type

`string`

The type for the item.

#### Returns

`void`

***

### getSchemaForType() {#getschemafortype}

> `static` **getSchemaForType**(`dataType`): `Promise`\<`SchemaObject` \| `undefined`\>

Get the JSON schema for a data type.

#### Parameters

##### dataType

`string`

The data type to get the schema for.

#### Returns

`Promise`\<`SchemaObject` \| `undefined`\>

The JSON schema for the data type or undefined if not found.

***

### getCompiledValidatorForType() {#getcompiledvalidatorfortype}

> `static` **getCompiledValidatorForType**(`dataType`): `Promise`\<[`ICompiledValidator`](../interfaces/ICompiledValidator.md) \| `undefined`\>

Get the compiled validator for a data type.

#### Parameters

##### dataType

`string`

The data type to get the compiled validator for.

#### Returns

`Promise`\<[`ICompiledValidator`](../interfaces/ICompiledValidator.md) \| `undefined`\>

The compiled validator for the data type or undefined if not found.

***

### validate() {#validate}

> `static` **validate**(`propertyName`, `dataType`, `data`, `validationFailures`, `options?`): `Promise`\<`boolean`\>

Validate a data type.

#### Parameters

##### propertyName

`string`

The name of the property being validated to use in error messages.

##### dataType

`string` \| `undefined`

The data type to validate.

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
