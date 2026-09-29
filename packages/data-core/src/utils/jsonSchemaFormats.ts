// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { fullFormats } from "ajv-formats/dist/formats.js";

/**
 * The JSON schema format validators, used by compiled validators so they do not depend on AJV.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const JsonSchemaFormats = fullFormats;

/**
 * The JSON schema format validators.
 */
export type JsonSchemaFormats = typeof JsonSchemaFormats;
