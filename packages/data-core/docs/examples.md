# Data Core Examples

These snippets show common workflows for registering types, validating payloads, and converting schema definitions.

## DataTypeHelper

```typescript
import { DataTypeHelper, type IJsonSchema } from '@twin.org/data-core';

const personSchema: IJsonSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://example.org/schema/person',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer', minimum: 0 }
  },
  required: ['name'],
  additionalProperties: false
};

DataTypeHelper.registerType(
  'https://example.org/schema/',
  'Person',
  'https://example.org/context',
  personSchema
);

const registeredSchema = await DataTypeHelper.getSchemaForType('https://example.org/schema/Person');
console.log('Registered schema id:', registeredSchema?.$id);
```

```typescript
import { type IValidationFailure } from '@twin.org/core';
import { DataTypeHelper, ValidationMode, type IJsonSchema } from '@twin.org/data-core';

const auditSchema: IJsonSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    createdAt: { type: 'string', format: 'date-time' }
  },
  required: ['createdAt'],
  additionalProperties: false
};

DataTypeHelper.registerTypes('https://example.org/schema/', 'https://example.org/context', [
  { type: 'Audit', schema: auditSchema }
]);

const failures: IValidationFailure[] = [];
const isValid = await DataTypeHelper.validate(
  'document',
  'https://example.org/schema/Audit',
  { createdAt: '2026-03-09T12:00:00Z' },
  failures,
  { validationMode: ValidationMode.JsonSchema, failOnMissingType: true }
);

console.log('Validation result:', isValid);
console.log('Failure count:', failures.length);
```

## JsonSchemaHelper

```typescript
import { JsonSchemaHelper, type IJsonSchema } from '@twin.org/data-core';

const credentialSchema: IJsonSchema = {
  $schema: JsonSchemaHelper.SCHEMA_VERSION,
  type: 'object',
  properties: {
    issuer: { type: 'string' },
    subject: { $ref: 'https://example.org/schema/Subject' }
  },
  required: ['issuer', 'subject'],
  additionalProperties: false
};

const validation = await JsonSchemaHelper.validate(credentialSchema, {
  issuer: 'did:example:issuer',
  subject: {
    id: 'did:example:subject'
  }
});

console.log('Schema validation result:', validation.result);
console.log(
  'Subject property type:',
  JsonSchemaHelper.getPropertyType(credentialSchema, 'subject')
);
```

```typescript
import type { IEntitySchema } from '@twin.org/entity';
import { JsonSchemaHelper } from '@twin.org/data-core';

const entitySchema: IEntitySchema = {
  type: 'Person',
  options: {
    description: 'A person record'
  },
  properties: [
    {
      property: 'name',
      type: 'string',
      optional: false,
      description: 'Display name'
    },
    {
      property: 'address',
      type: 'object',
      optional: true,
      itemTypeRef: 'Address'
    }
  ]
};

const jsonSchema = JsonSchemaHelper.entitySchemaToJsonSchema(
  entitySchema,
  'https://example.org/schemas'
);
console.log('Generated schema id:', jsonSchema.$id);
```
