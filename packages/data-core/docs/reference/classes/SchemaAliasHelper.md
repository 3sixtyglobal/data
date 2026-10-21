# Class: SchemaAliasHelper

Helper for aliasing schema URLs, e.g. when schemas move to a new domain.
An alias from is either a literal prefix, or a regular expression pattern when it starts with / e.g. /^https://old\.example//i
Aliases are plain strings so they can be serialised, e.g. in engine clone data.

## Constructors

### Constructor

> **new SchemaAliasHelper**(): `SchemaAliasHelper`

#### Returns

`SchemaAliasHelper`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### setAliases() {#setaliases}

> `static` **setAliases**(`aliases`): `void`

Replace the global alias list (use addAlias to append without replacing).

#### Parameters

##### aliases

`object`[]

The aliases to use.

#### Returns

`void`

#### Throws

GeneralError if a pattern is not a valid regular expression.

***

### getAliases() {#getaliases}

> `static` **getAliases**(): `object`[]

Get the global schema aliases.

#### Returns

`object`[]

The registered aliases.

***

### addAlias() {#addalias}

> `static` **addAlias**(`from`, `to`): `void`

Append an alias (ignored if the same from is already registered).
A literal prefix is replaced with to as-is.
A pattern should normally be anchored with ^, to can use $1, $&lt;name&gt; and $&amp; replacements, the sticky (y) flag is not supported.

#### Parameters

##### from

`string`

The prefix or pattern to alias from e.g. https://old.example/ or /^https://old\.example//

##### to

`string`

The replacement e.g. https://new.example/

#### Returns

`void`

#### Throws

GeneralError if the pattern is not a valid regular expression.

***

### resolve() {#resolve}

> `static` **resolve**(`value`): `string`

Resolve a type name or URL using the first matching alias.

#### Parameters

##### value

`string`

The type name or URL to resolve.

#### Returns

`string`

The aliased value, or the original value if no alias matches.
