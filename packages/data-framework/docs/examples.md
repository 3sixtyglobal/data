# Data Framework Examples

These examples show how to register framework data types and validate values against the registered handlers.

## FrameworkDataTypes

```typescript
import { type IValidationFailure } from '@3sixty/core';
import { DataTypeHelper, ValidationMode } from '@3sixty/data-core';
import { FrameworkContexts, FrameworkDataTypes, FrameworkTypes } from '@3sixty/data-framework';

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
