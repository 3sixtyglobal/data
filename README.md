# TWIN Data

This repository provides a shared set of data building blocks that help teams describe, validate, and query structured information in a consistent way. Together, the packages establish common models and helper utilities so applications and services can exchange data with fewer integration surprises and clearer contracts.

The workspace is organised so each package focuses on one concern, while still fitting into a coherent ecosystem for data handling and interoperability. This approach keeps the foundations reusable, reduces duplicated logic, and makes long-term maintenance more predictable.

## Packages

- [data-core](packages/data-core/README.md) - Shared schema models, identifiers, and validation utilities used across the repository.
- [data-json-ld](packages/data-json-ld/README.md) - [JSON-LD](https://json-ld.org/) data models and helpers for working with linked data documents.
- [data-framework](packages/data-framework/README.md) - Framework data models that define common structures used by other packages.
- [data-json-path](packages/data-json-path/README.md) - A consistent [JSONPath](https://goessner.net/articles/JsonPath/) query abstraction built on top of json-p3.

## Architecture

- [Data Validation](docs/architecture/data-validation.mdx) - Validation architecture across type handlers, JSON Schema, JSON-LD, and schema generation tooling.

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)
