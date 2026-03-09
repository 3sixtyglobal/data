# Data Framework Examples

These examples show how to register framework data types and validate values against the registered handlers.

## FrameworkDataTypes

```typescript
import { type IValidationFailure } from '@twin.org/core';
import { DataTypeHelper, ValidationMode } from '@twin.org/data-core';
import { FrameworkContexts, FrameworkDataTypes, FrameworkTypes } from '@twin.org/data-framework';

FrameworkDataTypes.registerTypes();

const failures: IValidationFailure[] = [];
const urnType = `${FrameworkContexts.Namespace}${FrameworkTypes.Urn}`;

const isValidUrn = await DataTypeHelper.validate(
  'resourceId',
  urnType,
  'urn:example:12345',
  failures,
  {
    validationMode: ValidationMode.Both,
    failOnMissingType: true
  }
);

console.log('URN validation result:', isValidUrn);
console.log('Failure count:', failures.length);
```
