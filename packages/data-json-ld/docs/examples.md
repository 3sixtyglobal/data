# Data Json Ld Examples

These examples walk through context management, document processing, validation, and property access patterns for JSON-LD documents.

## JsonLdProcessor

```typescript
import { JsonLdProcessor } from '@twin.org/data-json-ld';

JsonLdProcessor.setCacheLimit(900000);
console.log('Cache limit:', JsonLdProcessor.getCacheLimit());

JsonLdProcessor.setRedirects([
  {
    from: /^https:\/\/raw\.githubusercontent\.com\//,
    to: 'https://cdn.example.org/github-content'
  }
]);

JsonLdProcessor.addRedirect(/^https:\/\/schema\.org\//, 'https://schema.org/');
console.log('Has redirects:', JsonLdProcessor.getRedirects().length > 0);

const loader = JsonLdProcessor.getDocumentLoader();
console.log('Loader type:', typeof loader);
```

```typescript
import { JsonLdProcessor, type IJsonLdNodeObject } from '@twin.org/data-json-ld';

const compactedDoc = {
  '@context': {
    ex: 'https://example.org/vocab/',
    name: 'ex:name'
  },
  '@id': 'urn:example:person:1',
  name: 'Ada'
};

const expanded = await JsonLdProcessor.expand(compactedDoc);
const compactedAgain = await JsonLdProcessor.compact(expanded[0], compactedDoc['@context']);

console.log('Compacted id:', compactedAgain['@id']);

const canonical = await JsonLdProcessor.canonize(expanded[0] as IJsonLdNodeObject);
console.log('Canonical includes id:', canonical.includes('urn:example:person:1'));
```

```typescript
import { JsonLdProcessor, type IJsonLdNodeObject } from '@twin.org/data-json-ld';

const contextA = 'https://example.org/context/base';
const contextB = {
  ex: 'https://example.org/vocab/',
  name: 'ex:name'
};

const combined = JsonLdProcessor.combineContexts(contextA, contextB);

const documentWithNestedContexts: IJsonLdNodeObject = {
  '@context': contextA,
  '@graph': [
    {
      '@context': contextB,
      '@id': 'urn:example:item:1',
      '@type': 'ex:Person',
      'ex:name': 'Ada'
    }
  ]
};

const gathered = JsonLdProcessor.gatherContexts(documentWithNestedContexts);
const filtered = JsonLdProcessor.removeContexts(gathered, [contextB]);

console.log('Combined is array:', Array.isArray(combined));
console.log('Filtered context equals contextA:', filtered === contextA);
```

```typescript
import { JsonLdProcessor } from '@twin.org/data-json-ld';

await JsonLdProcessor.documentCacheAdd('https://example.org/context', {
  '@context': {
    ex: 'https://example.org/vocab/'
  }
});

await JsonLdProcessor.documentCacheRemove('https://example.org/context');
```

## JsonLdHelper

```typescript
import { type IValidationFailure } from '@twin.org/core';
import { ValidationMode } from '@twin.org/data-core';
import { JsonLdHelper, type IJsonLdNodeObject } from '@twin.org/data-json-ld';

const compactedDocument = {
  '@context': {
    ex: 'https://example.org/vocab/',
    id: '@id',
    type: '@type',
    name: 'ex:name'
  },
  id: 'urn:example:person:1',
  type: 'ex:Person',
  name: 'Ada'
};

const failures: IValidationFailure[] = [];
await JsonLdHelper.validate(compactedDocument, failures, {
  validationMode: ValidationMode.Either,
  failOnMissingType: false
});

const expanded = await JsonLdHelper.expand(compactedDocument);
const hasPersonType = await JsonLdHelper.isType(expanded, ['https://example.org/vocab/Person']);
const types = await JsonLdHelper.getType(expanded);
const id = await JsonLdHelper.getId(expanded);

console.log('Failure count:', failures.length);
console.log('Has person type:', hasPersonType);
console.log('Type list includes person:', types.includes('https://example.org/vocab/Person'));
console.log('Document id:', id);

const nodeObject = JsonLdHelper.toNodeObject(compactedDocument);
const structuredObject = JsonLdHelper.toStructuredObject<{ name: string }>(
  nodeObject as IJsonLdNodeObject
);

console.log('Structured name:', structuredObject.name);
```

```typescript
import { JsonLdHelper } from '@twin.org/data-json-ld';

const expandedDocument = [
  {
    '@id': 'urn:example:article:1',
    'https://schema.org/name': [
      { '@value': 'Hello', '@language': 'en' },
      { '@value': 'Hallo', '@language': 'de' }
    ],
    'https://schema.org/wordCount': [{ '@value': 240 }]
  }
];

const title = await JsonLdHelper.getPropertyValue(
  expandedDocument,
  'https://schema.org/name',
  'en'
);
const [nameValues, wordCountValues] = await JsonLdHelper.getPropertyValues(expandedDocument, [
  'https://schema.org/name',
  'https://schema.org/wordCount'
]);

console.log('English title:', title?.[0]);
console.log('Name value count:', nameValues?.length);
console.log('Word count value:', wordCountValues?.[0]);
```

```typescript
import { JsonLdHelper } from '@twin.org/data-json-ld';

const node = {
  '@id': 'urn:example:item:1',
  name: 'Ada',
  role: 'Engineer'
};

const prefixed = JsonLdHelper.prefixProperties(node, 'ex', ['name', 'role']);
const stripped = JsonLdHelper.stripPrefixProperties(prefixed, 'ex');

console.log('Prefixed name:', prefixed['ex:name']);
console.log('Stripped name:', stripped.name);
```

## JsonLdDataTypes

```typescript
import { DataTypeHelper } from '@twin.org/data-core';
import { JsonLdContexts, JsonLdDataTypes, JsonLdTypes } from '@twin.org/data-json-ld';

JsonLdDataTypes.registerTypes();

const schema = await DataTypeHelper.getSchemaForType(
  `${JsonLdContexts.Namespace}${JsonLdTypes.Document}`
);
console.log('Registered schema type:', schema?.type);
```
