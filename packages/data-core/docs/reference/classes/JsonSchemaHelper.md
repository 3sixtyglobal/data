# Class: JsonSchemaHelper

A helper for JSON schemas.

## Constructors

### Constructor

> **new JsonSchemaHelper**(): `JsonSchemaHelper`

#### Returns

`JsonSchemaHelper`

## Properties

### SCHEMA\_VERSION {#schema_version}

> `readonly` `static` **SCHEMA\_VERSION**: `"https://json-schema.org/draft/2020-12/schema"` = `"https://json-schema.org/draft/2020-12/schema"`

The schema version 2020 (default).

***

### SCHEMA\_VERSION\_2019 {#schema_version_2019}

> `readonly` `static` **SCHEMA\_VERSION\_2019**: `"https://json-schema.org/draft/2019-09/schema"` = `"https://json-schema.org/draft/2019-09/schema"`

The schema version 2019.

## Methods

### setLoggers() {#setloggers}

> `static` **setLoggers**(`loggers?`): `void`

Set the loggers used during schema loading.

#### Parameters

##### loggers?

Optional loggers for schema loading, useful when you have a lot of references in your schema and want to track the loading process.

###### loadingSchema?

(`uri`) => `Promise`\<`void`\>

Called when a schema is being loaded.

###### schemaLoaded?

(`uri`) => `Promise`\<`void`\>

Called when a schema has been successfully loaded.

###### schemaLoadFailed?

(`uri`, `error`) => `Promise`\<`void`\>

Called when a schema fails to load.

#### Returns

`void`

***

### validate() {#validate}

> `static` **validate**\<`T`\>(`schema`, `data`, `additionalTypes?`, `options?`): `Promise`\<`IValidationFailure`[]\>

Validates data against the schema.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### schema

`SchemaObject`

The schema to validate the data with.

##### data

`T`

The data to be validated.

##### additionalTypes?

Additional types to add for reference, not already in DataTypeHandlerFactory.

##### options?

Options for the validation.

###### throwOnMissing?

`boolean`

Throw if a referenced schema cannot be loaded, instead of treating it as an empty schema which matches any value, defaults to false.

#### Returns

`Promise`\<`IValidationFailure`[]\>

Result containing errors if there are any.

#### Throws

GeneralError if throwOnMissing is set and a referenced schema cannot be loaded.

***

### validateCompiled() {#validatecompiled}

> `static` **validateCompiled**\<`T`\>(`validator`, `data`): `IValidationFailure`[]

Validates data with a validator compiled ahead of time from a JSON schema.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### validator

[`ICompiledValidator`](../interfaces/ICompiledValidator.md)

The compiled validator to validate the data with.

##### data

`T`

The data to be validated.

#### Returns

`IValidationFailure`[]

Result containing errors if there are any.

***

### clearCache() {#clearcache}

> `static` **clearCache**(): `void`

Clear the compiled schemas, so the next validation compiles them again from the registered
data types, e.g. after a data type has been replaced or removed. A compiled schema includes
the schemas it references, so all of them are cleared rather than just the one which changed.

#### Returns

`void`

***

### getPropertyType() {#getpropertytype}

> `static` **getPropertyType**(`schema`, `propertyName`): `string` \| `undefined`

Get the property type from a schema.

#### Parameters

##### schema

`SchemaObject`

The schema to extract the types from.

##### propertyName

`string`

The name of the property to get the type for.

#### Returns

`string` \| `undefined`

The types of the property.

***

### entitySchemaToJsonSchema() {#entityschematojsonschema}

> `static` **entitySchemaToJsonSchema**(`entitySchema`, `baseDomain?`): `SchemaObject`

Convert an entity schema to JSON schema e.g https://example.com/schemas/.

#### Parameters

##### entitySchema

`IEntitySchema`\<`unknown`\> \| `undefined`

The entity schema to convert.

##### baseDomain?

`string`

The base domain for local schemas e.g. https://example.com/

#### Returns

`SchemaObject`

The JSON schema for the entity.
