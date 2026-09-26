// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonSchemaError } from "./IJsonSchemaError.js";

/**
 * A validator compiled ahead of time from a JSON schema, e.g. with AJV standalone code generation.
 */
export interface ICompiledValidator {
	/**
	 * Validate the data.
	 * @param data The data to validate.
	 * @returns True if the data is valid.
	 */
	(data: unknown): boolean;

	/**
	 * The errors from the most recent validation.
	 */
	errors?: IJsonSchemaError[] | null;
}
