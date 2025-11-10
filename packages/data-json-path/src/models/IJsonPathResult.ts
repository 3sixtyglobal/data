// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Result from a JSONPath query operation.
 */
export interface IJsonPathResult {
	/**
	 * The value at the matched path.
	 */
	value: unknown;

	/**
	 * The location path to the value.
	 */
	location: (string | number)[];

	/**
	 * The location path as a string for debugging.
	 */
	path: string;
}
