# Data Json Path Examples

These snippets cover common query and update workflows for nested JSON structures.

## JsonPathHelper

```typescript
import { JsonPathHelper } from '@twin.org/data-json-path';

const sample = {
  store: {
    book: [
      { title: 'The Left Hand of Darkness', price: 8.99 },
      { title: 'A Wizard of Earthsea', price: 6.5 }
    ]
  }
};

const queryResults = JsonPathHelper.query('$.store.book[*].title', sample);
console.log('Query result count:', queryResults.length);

console.log('Path exists:', JsonPathHelper.exists('$.store.book[0].price', sample));
console.log('Single value:', JsonPathHelper.extractSingle('$.store.book[0].title', sample));
console.log('All prices:', JsonPathHelper.extractAll('$.store.book[*].price', sample));
console.log('Path is valid:', JsonPathHelper.validate('$.store.book[*].title'));
```

```typescript
import { JsonPathHelper } from '@twin.org/data-json-path';

const profile = {
  user: {
    name: 'Ada',
    contact: {
      email: 'ada@example.org'
    }
  }
};

const emailNode = JsonPathHelper.query('$.user.contact.email', profile)[0];
JsonPathHelper.setAtLocation(profile, emailNode.location, 'ada.lovelace@example.org');

console.log('Updated email:', profile.user.contact.email);
```

```typescript
import { JsonPathHelper } from '@twin.org/data-json-path';

const payload = {
  user: {
    id: 'u-100',
    sessionToken: 'token-abc'
  }
};

const tokenNode = JsonPathHelper.query('$.user.sessionToken', payload)[0];
JsonPathHelper.deleteAtLocation(payload, tokenNode.location);

console.log('Token removed:', !('sessionToken' in payload.user));
```
