# Changelog

## [0.10.1-next.2](https://github.com/iotaledger/twin-data/compare/data-core-v0.10.1-next.1...data-core-v0.10.1-next.2) (2026-09-26)


### Features

* compiled schemas ([#111](https://github.com/iotaledger/twin-data/issues/111)) ([8c7aafd](https://github.com/iotaledger/twin-data/commit/8c7aafd0e3cf2b965b4e0dbc0a93c15e68dc08af))

## [0.10.1-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.10.1-next.0...data-core-v0.10.1-next.1) (2026-09-22)


### Features

* add contentEncoding base64 support to ajv ([#73](https://github.com/iotaledger/twin-data/issues/73)) ([b5c35f7](https://github.com/iotaledger/twin-data/commit/b5c35f790354db4f1f909a92527d3c957cb4f9f4))
* add context id features ([#25](https://github.com/iotaledger/twin-data/issues/25)) ([6592f2e](https://github.com/iotaledger/twin-data/commit/6592f2e4e59021cc42a079a4f46242758a54313d))
* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))
* align entity schema ([37e1c7f](https://github.com/iotaledger/twin-data/commit/37e1c7fc15cf7f5f518d47cb2eabdfdf0b8613e9))
* enhanced json schema validation ([#55](https://github.com/iotaledger/twin-data/issues/55)) ([a4dbf76](https://github.com/iotaledger/twin-data/commit/a4dbf768103356abca4b5bd91a0a5265819bc62b))
* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* expand JsonLdHelper.getId with custom properties names ([8ec4dcf](https://github.com/iotaledger/twin-data/commit/8ec4dcf807a6dc416b2df2a77749f841a60be05f))
* improve data type registration ([#34](https://github.com/iotaledger/twin-data/issues/34)) ([855d110](https://github.com/iotaledger/twin-data/commit/855d11046a4d85317b77a5c4e0f4a7b1b6d1a767))
* improve JSON schema speed ([#58](https://github.com/iotaledger/twin-data/issues/58)) ([551d74f](https://github.com/iotaledger/twin-data/commit/551d74f652bd88b9fe9d2f72800a3aa0dcb98c14))
* linting and dependency update ([a0d25f3](https://github.com/iotaledger/twin-data/commit/a0d25f3b94b079043f2645292f4d17233d776d74))
* support JSON Schema 2019 ([#31](https://github.com/iotaledger/twin-data/issues/31)) ([f798f72](https://github.com/iotaledger/twin-data/commit/f798f721c998cf50b8ba2318bec574069aad02ae))
* typescript 6 update ([44cbfe8](https://github.com/iotaledger/twin-data/commit/44cbfe87256282b9928134b2bbed1d3c6ee15acb))
* update components ([54901e4](https://github.com/iotaledger/twin-data/commit/54901e4032d0a072ab1afc601a92d54f96f16e9b))
* update dependencies ([b622475](https://github.com/iotaledger/twin-data/commit/b6224758e66ac3be563d68a670636356ce033434))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* ajv error validation ([#109](https://github.com/iotaledger/twin-data/issues/109)) ([b2af1d8](https://github.com/iotaledger/twin-data/commit/b2af1d85b7b9b87a42a0960283e36eecb29f1b5e))
* async cache test ([7a677a1](https://github.com/iotaledger/twin-data/commit/7a677a174af31725cd3633ca0e2f4bf3f86b8fc5))
* compile race ([#101](https://github.com/iotaledger/twin-data/issues/101)) ([24d7392](https://github.com/iotaledger/twin-data/commit/24d7392dd6540199c08bc1446db91ac4510238c7))
* dedupe in-flight compileAsync by schemaId ([#70](https://github.com/iotaledger/twin-data/issues/70)) ([fcd0e70](https://github.com/iotaledger/twin-data/commit/fcd0e7082b0ebed465faf718097adf19340b287c))
* getSchemaForType async ([a26a4f0](https://github.com/iotaledger/twin-data/commit/a26a4f09d6e22ee0882597b71a134db3079d72d0))
* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.10.0](https://github.com/iotaledger/twin-data/compare/data-core-v0.10.0...data-core-v0.10.0) (2026-09-16)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* release to production ([#82](https://github.com/iotaledger/twin-data/issues/82)) ([edd0d67](https://github.com/iotaledger/twin-data/commit/edd0d67b9d85e0f234c7f55ef2548baaa3596b4c))
* release to production ([#91](https://github.com/iotaledger/twin-data/issues/91)) ([6f77214](https://github.com/iotaledger/twin-data/commit/6f772143556b4de81b480f454984adf0afa17d7e))
* release to production ([#97](https://github.com/iotaledger/twin-data/issues/97)) ([7857485](https://github.com/iotaledger/twin-data/commit/7857485d50c22b005cd148d4686b736fdc4d5401))
* release to production [skip ci] ([#105](https://github.com/iotaledger/twin-data/issues/105)) ([05e12aa](https://github.com/iotaledger/twin-data/commit/05e12aaea22cd544dde256372c62f238fc97b422))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.3-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.3-next.0...data-core-v0.9.3-next.1) (2026-09-10)


### Features

* add contentEncoding base64 support to ajv ([#73](https://github.com/iotaledger/twin-data/issues/73)) ([b5c35f7](https://github.com/iotaledger/twin-data/commit/b5c35f790354db4f1f909a92527d3c957cb4f9f4))
* add context id features ([#25](https://github.com/iotaledger/twin-data/issues/25)) ([6592f2e](https://github.com/iotaledger/twin-data/commit/6592f2e4e59021cc42a079a4f46242758a54313d))
* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))
* align entity schema ([37e1c7f](https://github.com/iotaledger/twin-data/commit/37e1c7fc15cf7f5f518d47cb2eabdfdf0b8613e9))
* enhanced json schema validation ([#55](https://github.com/iotaledger/twin-data/issues/55)) ([a4dbf76](https://github.com/iotaledger/twin-data/commit/a4dbf768103356abca4b5bd91a0a5265819bc62b))
* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* expand JsonLdHelper.getId with custom properties names ([8ec4dcf](https://github.com/iotaledger/twin-data/commit/8ec4dcf807a6dc416b2df2a77749f841a60be05f))
* improve data type registration ([#34](https://github.com/iotaledger/twin-data/issues/34)) ([855d110](https://github.com/iotaledger/twin-data/commit/855d11046a4d85317b77a5c4e0f4a7b1b6d1a767))
* improve JSON schema speed ([#58](https://github.com/iotaledger/twin-data/issues/58)) ([551d74f](https://github.com/iotaledger/twin-data/commit/551d74f652bd88b9fe9d2f72800a3aa0dcb98c14))
* linting and dependency update ([a0d25f3](https://github.com/iotaledger/twin-data/commit/a0d25f3b94b079043f2645292f4d17233d776d74))
* support JSON Schema 2019 ([#31](https://github.com/iotaledger/twin-data/issues/31)) ([f798f72](https://github.com/iotaledger/twin-data/commit/f798f721c998cf50b8ba2318bec574069aad02ae))
* typescript 6 update ([44cbfe8](https://github.com/iotaledger/twin-data/commit/44cbfe87256282b9928134b2bbed1d3c6ee15acb))
* update components ([54901e4](https://github.com/iotaledger/twin-data/commit/54901e4032d0a072ab1afc601a92d54f96f16e9b))
* update dependencies ([b622475](https://github.com/iotaledger/twin-data/commit/b6224758e66ac3be563d68a670636356ce033434))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* async cache test ([7a677a1](https://github.com/iotaledger/twin-data/commit/7a677a174af31725cd3633ca0e2f4bf3f86b8fc5))
* compile race ([#101](https://github.com/iotaledger/twin-data/issues/101)) ([24d7392](https://github.com/iotaledger/twin-data/commit/24d7392dd6540199c08bc1446db91ac4510238c7))
* dedupe in-flight compileAsync by schemaId ([#70](https://github.com/iotaledger/twin-data/issues/70)) ([fcd0e70](https://github.com/iotaledger/twin-data/commit/fcd0e7082b0ebed465faf718097adf19340b287c))
* getSchemaForType async ([a26a4f0](https://github.com/iotaledger/twin-data/commit/a26a4f09d6e22ee0882597b71a134db3079d72d0))
* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.2](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.2...data-core-v0.9.2) (2026-08-24)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* release to production ([#82](https://github.com/iotaledger/twin-data/issues/82)) ([edd0d67](https://github.com/iotaledger/twin-data/commit/edd0d67b9d85e0f234c7f55ef2548baaa3596b4c))
* release to production ([#91](https://github.com/iotaledger/twin-data/issues/91)) ([6f77214](https://github.com/iotaledger/twin-data/commit/6f772143556b4de81b480f454984adf0afa17d7e))
* release to production ([#97](https://github.com/iotaledger/twin-data/issues/97)) ([7857485](https://github.com/iotaledger/twin-data/commit/7857485d50c22b005cd148d4686b736fdc4d5401))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.2-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.2-next.0...data-core-v0.9.2-next.1) (2026-08-07)


### Features

* add contentEncoding base64 support to ajv ([#73](https://github.com/iotaledger/twin-data/issues/73)) ([b5c35f7](https://github.com/iotaledger/twin-data/commit/b5c35f790354db4f1f909a92527d3c957cb4f9f4))
* add context id features ([#25](https://github.com/iotaledger/twin-data/issues/25)) ([6592f2e](https://github.com/iotaledger/twin-data/commit/6592f2e4e59021cc42a079a4f46242758a54313d))
* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))
* align entity schema ([37e1c7f](https://github.com/iotaledger/twin-data/commit/37e1c7fc15cf7f5f518d47cb2eabdfdf0b8613e9))
* enhanced json schema validation ([#55](https://github.com/iotaledger/twin-data/issues/55)) ([a4dbf76](https://github.com/iotaledger/twin-data/commit/a4dbf768103356abca4b5bd91a0a5265819bc62b))
* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* expand JsonLdHelper.getId with custom properties names ([8ec4dcf](https://github.com/iotaledger/twin-data/commit/8ec4dcf807a6dc416b2df2a77749f841a60be05f))
* improve data type registration ([#34](https://github.com/iotaledger/twin-data/issues/34)) ([855d110](https://github.com/iotaledger/twin-data/commit/855d11046a4d85317b77a5c4e0f4a7b1b6d1a767))
* improve JSON schema speed ([#58](https://github.com/iotaledger/twin-data/issues/58)) ([551d74f](https://github.com/iotaledger/twin-data/commit/551d74f652bd88b9fe9d2f72800a3aa0dcb98c14))
* linting and dependency update ([a0d25f3](https://github.com/iotaledger/twin-data/commit/a0d25f3b94b079043f2645292f4d17233d776d74))
* support JSON Schema 2019 ([#31](https://github.com/iotaledger/twin-data/issues/31)) ([f798f72](https://github.com/iotaledger/twin-data/commit/f798f721c998cf50b8ba2318bec574069aad02ae))
* typescript 6 update ([44cbfe8](https://github.com/iotaledger/twin-data/commit/44cbfe87256282b9928134b2bbed1d3c6ee15acb))
* update components ([54901e4](https://github.com/iotaledger/twin-data/commit/54901e4032d0a072ab1afc601a92d54f96f16e9b))
* update dependencies ([b622475](https://github.com/iotaledger/twin-data/commit/b6224758e66ac3be563d68a670636356ce033434))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* async cache test ([7a677a1](https://github.com/iotaledger/twin-data/commit/7a677a174af31725cd3633ca0e2f4bf3f86b8fc5))
* dedupe in-flight compileAsync by schemaId ([#70](https://github.com/iotaledger/twin-data/issues/70)) ([fcd0e70](https://github.com/iotaledger/twin-data/commit/fcd0e7082b0ebed465faf718097adf19340b287c))
* getSchemaForType async ([a26a4f0](https://github.com/iotaledger/twin-data/commit/a26a4f09d6e22ee0882597b71a134db3079d72d0))
* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.1...data-core-v0.9.1) (2026-07-27)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* release to production ([#82](https://github.com/iotaledger/twin-data/issues/82)) ([edd0d67](https://github.com/iotaledger/twin-data/commit/edd0d67b9d85e0f234c7f55ef2548baaa3596b4c))
* release to production ([#91](https://github.com/iotaledger/twin-data/issues/91)) ([6f77214](https://github.com/iotaledger/twin-data/commit/6f772143556b4de81b480f454984adf0afa17d7e))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.1-next.2](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.1-next.1...data-core-v0.9.1-next.2) (2026-07-20)


### Features

* update components ([54901e4](https://github.com/iotaledger/twin-data/commit/54901e4032d0a072ab1afc601a92d54f96f16e9b))

## [0.9.1-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.1-next.0...data-core-v0.9.1-next.1) (2026-06-26)


### Features

* add contentEncoding base64 support to ajv ([#73](https://github.com/iotaledger/twin-data/issues/73)) ([b5c35f7](https://github.com/iotaledger/twin-data/commit/b5c35f790354db4f1f909a92527d3c957cb4f9f4))
* add context id features ([#25](https://github.com/iotaledger/twin-data/issues/25)) ([6592f2e](https://github.com/iotaledger/twin-data/commit/6592f2e4e59021cc42a079a4f46242758a54313d))
* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))
* align entity schema ([37e1c7f](https://github.com/iotaledger/twin-data/commit/37e1c7fc15cf7f5f518d47cb2eabdfdf0b8613e9))
* enhanced json schema validation ([#55](https://github.com/iotaledger/twin-data/issues/55)) ([a4dbf76](https://github.com/iotaledger/twin-data/commit/a4dbf768103356abca4b5bd91a0a5265819bc62b))
* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* expand JsonLdHelper.getId with custom properties names ([8ec4dcf](https://github.com/iotaledger/twin-data/commit/8ec4dcf807a6dc416b2df2a77749f841a60be05f))
* improve data type registration ([#34](https://github.com/iotaledger/twin-data/issues/34)) ([855d110](https://github.com/iotaledger/twin-data/commit/855d11046a4d85317b77a5c4e0f4a7b1b6d1a767))
* improve JSON schema speed ([#58](https://github.com/iotaledger/twin-data/issues/58)) ([551d74f](https://github.com/iotaledger/twin-data/commit/551d74f652bd88b9fe9d2f72800a3aa0dcb98c14))
* support JSON Schema 2019 ([#31](https://github.com/iotaledger/twin-data/issues/31)) ([f798f72](https://github.com/iotaledger/twin-data/commit/f798f721c998cf50b8ba2318bec574069aad02ae))
* typescript 6 update ([44cbfe8](https://github.com/iotaledger/twin-data/commit/44cbfe87256282b9928134b2bbed1d3c6ee15acb))
* update dependencies ([b622475](https://github.com/iotaledger/twin-data/commit/b6224758e66ac3be563d68a670636356ce033434))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* async cache test ([7a677a1](https://github.com/iotaledger/twin-data/commit/7a677a174af31725cd3633ca0e2f4bf3f86b8fc5))
* dedupe in-flight compileAsync by schemaId ([#70](https://github.com/iotaledger/twin-data/issues/70)) ([fcd0e70](https://github.com/iotaledger/twin-data/commit/fcd0e7082b0ebed465faf718097adf19340b287c))
* getSchemaForType async ([a26a4f0](https://github.com/iotaledger/twin-data/commit/a26a4f09d6e22ee0882597b71a134db3079d72d0))
* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.0](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.0...data-core-v0.9.0) (2026-06-22)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* release to production ([#82](https://github.com/iotaledger/twin-data/issues/82)) ([edd0d67](https://github.com/iotaledger/twin-data/commit/edd0d67b9d85e0f234c7f55ef2548baaa3596b4c))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.9.0-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.9.0-next.0...data-core-v0.9.0-next.1) (2026-06-22)


### Features

* add contentEncoding base64 support to ajv ([#73](https://github.com/iotaledger/twin-data/issues/73)) ([b5c35f7](https://github.com/iotaledger/twin-data/commit/b5c35f790354db4f1f909a92527d3c957cb4f9f4))
* add context id features ([#25](https://github.com/iotaledger/twin-data/issues/25)) ([6592f2e](https://github.com/iotaledger/twin-data/commit/6592f2e4e59021cc42a079a4f46242758a54313d))
* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))
* align entity schema ([37e1c7f](https://github.com/iotaledger/twin-data/commit/37e1c7fc15cf7f5f518d47cb2eabdfdf0b8613e9))
* enhanced json schema validation ([#55](https://github.com/iotaledger/twin-data/issues/55)) ([a4dbf76](https://github.com/iotaledger/twin-data/commit/a4dbf768103356abca4b5bd91a0a5265819bc62b))
* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* expand JsonLdHelper.getId with custom properties names ([8ec4dcf](https://github.com/iotaledger/twin-data/commit/8ec4dcf807a6dc416b2df2a77749f841a60be05f))
* improve data type registration ([#34](https://github.com/iotaledger/twin-data/issues/34)) ([855d110](https://github.com/iotaledger/twin-data/commit/855d11046a4d85317b77a5c4e0f4a7b1b6d1a767))
* improve JSON schema speed ([#58](https://github.com/iotaledger/twin-data/issues/58)) ([551d74f](https://github.com/iotaledger/twin-data/commit/551d74f652bd88b9fe9d2f72800a3aa0dcb98c14))
* support JSON Schema 2019 ([#31](https://github.com/iotaledger/twin-data/issues/31)) ([f798f72](https://github.com/iotaledger/twin-data/commit/f798f721c998cf50b8ba2318bec574069aad02ae))
* typescript 6 update ([44cbfe8](https://github.com/iotaledger/twin-data/commit/44cbfe87256282b9928134b2bbed1d3c6ee15acb))
* update dependencies ([b622475](https://github.com/iotaledger/twin-data/commit/b6224758e66ac3be563d68a670636356ce033434))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* async cache test ([7a677a1](https://github.com/iotaledger/twin-data/commit/7a677a174af31725cd3633ca0e2f4bf3f86b8fc5))
* dedupe in-flight compileAsync by schemaId ([#70](https://github.com/iotaledger/twin-data/issues/70)) ([fcd0e70](https://github.com/iotaledger/twin-data/commit/fcd0e7082b0ebed465faf718097adf19340b287c))
* getSchemaForType async ([a26a4f0](https://github.com/iotaledger/twin-data/commit/a26a4f09d6e22ee0882597b71a134db3079d72d0))
* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.0.3-next.26](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.25...data-core-v0.0.3-next.26) (2026-06-05)


### Features

* align entity schema ([37e1c7f](https://github.com/iotaledger/twin-data/commit/37e1c7fc15cf7f5f518d47cb2eabdfdf0b8613e9))


### Bug Fixes

* async cache test ([7a677a1](https://github.com/iotaledger/twin-data/commit/7a677a174af31725cd3633ca0e2f4bf3f86b8fc5))

## [0.0.3-next.25](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.24...data-core-v0.0.3-next.25) (2026-06-01)


### Features

* add contentEncoding base64 support to ajv ([#73](https://github.com/iotaledger/twin-data/issues/73)) ([b5c35f7](https://github.com/iotaledger/twin-data/commit/b5c35f790354db4f1f909a92527d3c957cb4f9f4))

## [0.0.3-next.24](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.23...data-core-v0.0.3-next.24) (2026-05-22)


### Bug Fixes

* dedupe in-flight compileAsync by schemaId ([#70](https://github.com/iotaledger/twin-data/issues/70)) ([fcd0e70](https://github.com/iotaledger/twin-data/commit/fcd0e7082b0ebed465faf718097adf19340b287c))

## [0.0.3-next.23](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.22...data-core-v0.0.3-next.23) (2026-05-19)


### Features

* update dependencies ([b622475](https://github.com/iotaledger/twin-data/commit/b6224758e66ac3be563d68a670636356ce033434))

## [0.0.3-next.22](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.21...data-core-v0.0.3-next.22) (2026-05-13)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.21](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.20...data-core-v0.0.3-next.21) (2026-05-11)


### Features

* typescript 6 update ([44cbfe8](https://github.com/iotaledger/twin-data/commit/44cbfe87256282b9928134b2bbed1d3c6ee15acb))

## [0.0.3-next.20](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.19...data-core-v0.0.3-next.20) (2026-03-24)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.19](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.18...data-core-v0.0.3-next.19) (2026-03-20)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.18](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.17...data-core-v0.0.3-next.18) (2026-03-16)


### Features

* improve JSON schema speed ([#58](https://github.com/iotaledger/twin-data/issues/58)) ([551d74f](https://github.com/iotaledger/twin-data/commit/551d74f652bd88b9fe9d2f72800a3aa0dcb98c14))

## [0.0.3-next.17](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.16...data-core-v0.0.3-next.17) (2026-03-12)


### Features

* enhanced json schema validation ([#55](https://github.com/iotaledger/twin-data/issues/55)) ([a4dbf76](https://github.com/iotaledger/twin-data/commit/a4dbf768103356abca4b5bd91a0a5265819bc62b))

## [0.0.3-next.16](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.15...data-core-v0.0.3-next.16) (2026-03-06)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.15](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.14...data-core-v0.0.3-next.15) (2026-02-27)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.14](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.13...data-core-v0.0.3-next.14) (2026-02-25)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.13](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.12...data-core-v0.0.3-next.13) (2026-02-25)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.12](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.11...data-core-v0.0.3-next.12) (2026-02-25)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.11](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.10...data-core-v0.0.3-next.11) (2026-02-25)


### Features

* expand JsonLdHelper.getId with custom properties names ([8ec4dcf](https://github.com/iotaledger/twin-data/commit/8ec4dcf807a6dc416b2df2a77749f841a60be05f))

## [0.0.3-next.10](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.9...data-core-v0.0.3-next.10) (2026-02-24)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.9](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.8...data-core-v0.0.3-next.9) (2026-02-23)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.8](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.7...data-core-v0.0.3-next.8) (2026-02-02)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.7](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.6...data-core-v0.0.3-next.7) (2026-01-21)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.6](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.5...data-core-v0.0.3-next.6) (2026-01-14)


### Bug Fixes

* getSchemaForType async ([a26a4f0](https://github.com/iotaledger/twin-data/commit/a26a4f09d6e22ee0882597b71a134db3079d72d0))

## [0.0.3-next.5](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.4...data-core-v0.0.3-next.5) (2026-01-14)


### Features

* improve data type registration ([#34](https://github.com/iotaledger/twin-data/issues/34)) ([855d110](https://github.com/iotaledger/twin-data/commit/855d11046a4d85317b77a5c4e0f4a7b1b6d1a767))

## [0.0.3-next.4](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.3...data-core-v0.0.3-next.4) (2026-01-06)


### Features

* support JSON Schema 2019 ([#31](https://github.com/iotaledger/twin-data/issues/31)) ([f798f72](https://github.com/iotaledger/twin-data/commit/f798f721c998cf50b8ba2318bec574069aad02ae))

## [0.0.3-next.3](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.2...data-core-v0.0.3-next.3) (2026-01-05)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.2](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.1...data-core-v0.0.3-next.2) (2025-11-24)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.3-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.3-next.0...data-core-v0.0.3-next.1) (2025-11-10)


### Features

* add context id features ([#25](https://github.com/iotaledger/twin-data/issues/25)) ([6592f2e](https://github.com/iotaledger/twin-data/commit/6592f2e4e59021cc42a079a4f46242758a54313d))
* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))
* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.0.2-next.4](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.2-next.3...data-core-v0.0.2-next.4) (2025-10-09)


### Features

* add validate-locales ([cf9b761](https://github.com/iotaledger/twin-data/commit/cf9b76160820fe0b13b4fe56ed241c1d5511b7c1))

## [0.0.2-next.3](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.2-next.2...data-core-v0.0.2-next.3) (2025-09-29)


### Features

* use updated Is.function ([46a4715](https://github.com/iotaledger/twin-data/commit/46a4715f995aea34f2011138662fe003c9727d07))

## [0.0.2-next.2](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.2-next.1...data-core-v0.0.2-next.2) (2025-08-29)


### Features

* eslint migration to flat config ([b0db6e6](https://github.com/iotaledger/twin-data/commit/b0db6e69a90046fc60d29e4273fcdfee13c16088))

## [0.0.2-next.1](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.2-next.0...data-core-v0.0.2-next.1) (2025-08-19)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* update framework core ([c077b8c](https://github.com/iotaledger/twin-data/commit/c077b8c07e7ee66b5482254eab6f2a52cd911270))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## 0.0.1 (2025-07-03)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))
* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))
* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))
* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))
* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))
* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* interface name ([6e49322](https://github.com/iotaledger/twin-data/commit/6e49322ec1797417220ec9e529bb124f4717f489))
* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))
* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.0.1-next.37](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.36...data-core-v0.0.1-next.37) (2025-06-11)


### Features

* use updated JSON schema specs ([465223a](https://github.com/iotaledger/twin-data/commit/465223a9e9c24af546480ef084327a78fa366eaa))


### Bug Fixes

* remove undici reference ([d77721e](https://github.com/iotaledger/twin-data/commit/d77721e21d23c7a6750c2f5cac8104851dfaa6d7))

## [0.0.1-next.36](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.35...data-core-v0.0.1-next.36) (2025-06-10)


### Features

* expand Json LD Keyword ([70632d1](https://github.com/iotaledger/twin-data/commit/70632d1e11ad85cf3c57e118476b125a673f1681))

## [0.0.1-next.35](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.34...data-core-v0.0.1-next.35) (2025-06-03)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.1-next.34](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.33...data-core-v0.0.1-next.34) (2025-06-02)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.1-next.33](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.32...data-core-v0.0.1-next.33) (2025-06-02)


### Features

* add fail on missing type option and both mode ([e8b9702](https://github.com/iotaledger/twin-data/commit/e8b97029a04b646497ff0e55b9610291e58ae92a))


### Bug Fixes

* tests using context ([577b3bb](https://github.com/iotaledger/twin-data/commit/577b3bbb661eafbf6d3fd157133c106732e8eb3d))

## [0.0.1-next.32](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.31...data-core-v0.0.1-next.32) (2025-05-28)


### Features

* use fully qualified names for data type lookups ([b7b5c74](https://github.com/iotaledger/twin-data/commit/b7b5c746b0180a87baa976f6a7a76cedd53d8ff7))

## [0.0.1-next.31](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.30...data-core-v0.0.1-next.31) (2025-05-08)


### Miscellaneous Chores

* **data-core:** Synchronize repo versions

## [0.0.1-next.30](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.29...data-core-v0.0.1-next.30) (2025-04-17)


### Features

* use shared store mechanism ([#3](https://github.com/iotaledger/twin-data/issues/3)) ([33eb221](https://github.com/iotaledger/twin-data/commit/33eb221ccec2b4a79549c06e9a04225009b93a46))

## [0.0.1-next.29](https://github.com/iotaledger/twin-data/compare/data-core-v0.0.1-next.28...data-core-v0.0.1-next.29) (2025-03-28)


### Features

* add document cache access methods ([dbf1e36](https://github.com/iotaledger/twin-data/commit/dbf1e36d176c5f428f8c52628fb5a1ff7a6a174a))

## v0.0.1-next.28

- Initial Release
