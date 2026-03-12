# Class: JsonPathHelper

Helper class for JSONPath operations.
Provides abstraction over the json-p3 library.

## Constructors

### Constructor

> **new JsonPathHelper**(): `JsonPathHelper`

#### Returns

`JsonPathHelper`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The name of the class name of the JsonPathHelper class.

## Methods

### query() {#query}

> `static` **query**(`path`, `data`): [`IJsonPathResult`](../interfaces/IJsonPathResult.md)[]

Execute a JSONPath query and return results with values and locations.

#### Parameters

##### path

`string`

The JSONPath query string (e.g., "$.store.book[*].title").

##### data

`unknown`

The data to query.

#### Returns

[`IJsonPathResult`](../interfaces/IJsonPathResult.md)[]

Array of results containing values and their locations.

#### Throws

GeneralError if the path is invalid or data cannot be queried.

***

### exists() {#exists}

> `static` **exists**(`path`, `data`): `boolean`

Check if a JSONPath exists in the data.

#### Parameters

##### path

`string`

The JSONPath query string.

##### data

`unknown`

The data to check.

#### Returns

`boolean`

True if the path exists and returns at least one result.

***

### extractSingle() {#extractsingle}

> `static` **extractSingle**(`path`, `data`): `unknown`

Extract the first value from a JSONPath query.

#### Parameters

##### path

`string`

The JSONPath query string.

##### data

`unknown`

The data to query.

#### Returns

`unknown`

The first matched value, or undefined if no matches.

#### Throws

GeneralError if the path is invalid or data cannot be queried.

***

### extractAll() {#extractall}

> `static` **extractAll**(`path`, `data`): `unknown`[]

Extract all values from a JSONPath query.

#### Parameters

##### path

`string`

The JSONPath query string.

##### data

`unknown`

The data to query.

#### Returns

`unknown`[]

Array of all matched values.

#### Throws

GeneralError if the path is invalid or data cannot be queried.

***

### validate() {#validate}

> `static` **validate**(`path`): `boolean`

Validate if a JSONPath query is valid.

#### Parameters

##### path

`string`

The JSONPath query string to validate.

#### Returns

`boolean`

True if the syntax is valid.

#### Throws

GeneralError if the path is invalid or data cannot be queried.

***

### setAtLocation() {#setatlocation}

> `static` **setAtLocation**(`root`, `location`, `value`): `void`

Set a value on the target object using a JSONPath location.

#### Parameters

##### root

`unknown`

The target root object.

##### location

[`IJsonPathLocation`](../type-aliases/IJsonPathLocation.md)

The JSONPath location tokens.

##### value

`unknown`

The value to set.

#### Returns

`void`

***

### deleteAtLocation() {#deleteatlocation}

> `static` **deleteAtLocation**(`root`, `location`): `void`

Delete a value on the target object using a JSONPath location.

#### Parameters

##### root

`unknown`

The target root object.

##### location

[`IJsonPathLocation`](../type-aliases/IJsonPathLocation.md)

The JSONPath location tokens.

#### Returns

`void`
