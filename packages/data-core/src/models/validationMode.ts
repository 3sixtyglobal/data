// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Validation modes for validating data types.
 */
export const ValidationMode = {
	/**
	 * Use the validation method of the data type.
	 */
	Validate: "validate",

	/**
	 * Use the JSON Schema methods of the data type.
	 */
	JsonSchema: "json-schema",

	/**
	 * Use either validation mode.
	 */
	Either: "either",

	/**
	 * Use both validation modes.
	 */
	Both: "both"
} as const;

/**
 * Validation modes for validating data types.
 */
export type ValidationMode = (typeof ValidationMode)[keyof typeof ValidationMode];
