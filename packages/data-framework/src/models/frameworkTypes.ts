// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The types of framework data.
 */
export const FrameworkTypes = {
	/**
	 * Represents a urn.
	 */
	Urn: "URN",

	/**
	 * Represents a timestamp as an integer, milliseconds since 1 Jan 1970.
	 */
	TimestampMilliseconds: "TimestampMilliseconds",

	/**
	 * Represents a timestamp as an integer, seconds since 1 Jan 1970.
	 */
	TimestampSeconds: "TimestampSeconds"
} as const;

/**
 * The types of framework data.
 */
export type FrameworkTypes = (typeof FrameworkTypes)[keyof typeof FrameworkTypes];
