# Data Packages

## data-core

This package serves as a foundational component within the repository. Its primary purpose is to provide shared schema models, identifiers, and validation utilities that other packages can depend on for consistent behaviour. By doing so, it enables a reliable and centralised approach to common data concerns and aligns practical implementation with established [JSON Schema](https://json-schema.org/) patterns.

- [README](../packages/data-core/README.md)
- [Examples](../packages/data-core/docs/examples.md)
- [Changelog](../packages/data-core/docs/changelog.md)

## data-json-ld

This package is designed to model and support linked data payloads using [JSON-LD](https://json-ld.org/) structures. It plays a crucial role in ensuring that semantic data exchanged across the repository remains interoperable, expressive, and easier to maintain as integrations expand.

- [README](../packages/data-json-ld/README.md)
- [Examples](../packages/data-json-ld/docs/examples.md)
- [Changelog](../packages/data-json-ld/docs/changelog.md)

## data-framework

This package addresses the definition of framework-level data structures that are reused throughout the repository. It is intended to streamline development workflows by giving teams a consistent set of shared models, improving clarity and reducing duplication across dependent packages.

- [README](../packages/data-framework/README.md)
- [Examples](../packages/data-framework/docs/examples.md)
- [Changelog](../packages/data-framework/docs/changelog.md)

## data-json-path

This package focuses on providing a stable abstraction for querying JSON documents with [JSONPath](https://goessner.net/articles/JsonPath/). Its role is to make querying behaviour more predictable and reusable so consumers can navigate nested data safely across different parts of the ecosystem.

- [README](../packages/data-json-path/README.md)
- [Examples](../packages/data-json-path/docs/examples.md)
- [Changelog](../packages/data-json-path/docs/changelog.md)
