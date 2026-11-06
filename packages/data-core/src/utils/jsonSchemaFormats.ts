// Copyright 2026 IOTA Stiftung.
// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { fullFormats } from "ajv-formats/dist/formats.js";

/**
 * The JSON schema format validators, used by compiled validators so they do not depend on AJV.
 */
export const JsonSchemaFormats = fullFormats;
