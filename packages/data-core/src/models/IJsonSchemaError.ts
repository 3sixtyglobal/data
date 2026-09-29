// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type Ajv from "ajv/dist/2020.js";

/**
 * An error reported when validating data against a JSON schema.
 */
export type IJsonSchemaError = Ajv.ErrorObject;
