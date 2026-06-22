// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonPathLocation } from "./IJsonPathLocation.js";

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
	location: IJsonPathLocation;

	/**
	 * The location path as a string for debugging.
	 */
	path: string;
}
