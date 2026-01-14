// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of framework data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FrameworkContexts = {
	/**
	 * Namespace.
	 */
	Namespace: "https://schema.twindev.org/framework/"
} as const;

/**
 * The contexts of framework data.
 */
export type FrameworkContexts = (typeof FrameworkContexts)[keyof typeof FrameworkContexts];
