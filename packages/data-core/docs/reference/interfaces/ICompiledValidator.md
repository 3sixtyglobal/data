# Interface: ICompiledValidator()

A validator compiled ahead of time from a JSON schema, e.g. with AJV standalone code generation.

> **ICompiledValidator**(`data`): `boolean`

Validate the data.

## Parameters

### data

`unknown`

The data to validate.

## Returns

`boolean`

True if the data is valid.

## Properties

### errors? {#errors}

> `optional` **errors?**: [`IJsonSchemaError`](../type-aliases/IJsonSchemaError.md)[] \| `null`

The errors from the most recent validation.
