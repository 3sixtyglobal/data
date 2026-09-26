# Interface: IDataTypeHandler

Interface describing a type which can handle a specific data type.

## Properties

### namespace {#namespace}

> **namespace**: `string`

The namespace for the type.

***

### type {#type}

> **type**: `string`

The type for the item.

***

### jsonLdContext? {#jsonldcontext}

> `optional` **jsonLdContext?**: `string`

The JSON LD context for the type.

***

### defaultValue? {#defaultvalue}

> `optional` **defaultValue?**: `unknown`

The default value for the item to use when constructing a new object.

## Methods

### jsonSchema()? {#jsonschema}

> `optional` **jsonSchema**(): `Promise`\<`SchemaObject` \| `undefined`\>

Get the JSON schema for the data type.

#### Returns

`Promise`\<`SchemaObject` \| `undefined`\>

The JSON schema for the data type.

***

### compiledValidator()? {#compiledvalidator}

> `optional` **compiledValidator**(): `Promise`\<[`ICompiledValidator`](ICompiledValidator.md) \| `undefined`\>

Get the validator compiled from the JSON schema, used in place of compiling the schema at runtime.

#### Returns

`Promise`\<[`ICompiledValidator`](ICompiledValidator.md) \| `undefined`\>

The compiled validator for the data type.

***

### validate()? {#validate}

> `optional` **validate**(`propertyName`, `value`, `failures`, `container?`): `Promise`\<`boolean`\>

A method for validating the data type.

#### Parameters

##### propertyName

`string`

The name of the property being validated.

##### value

`unknown`

The value to validate.

##### failures

`IValidationFailure`[]

List of failures to add to.

##### container?

`unknown`

The object which contains this one.

#### Returns

`Promise`\<`boolean`\>

True if the item is valid.
