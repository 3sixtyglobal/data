// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Urn, Validation } from "@twin.org/core";
import { DataTypeHandlerFactory, type IJsonSchema } from "@twin.org/data-core";
import { FrameworkContexts } from "../models/frameworkContexts.js";
import { FrameworkTypes } from "../models/frameworkTypes.js";
import TimestampMillisecondsSchema from "../schemas/TimestampMilliseconds.json" with { type: "json" };
import TimestampSecondsSchema from "../schemas/TimestampSeconds.json" with { type: "json" };
import URNSchema from "../schemas/URN.json" with { type: "json" };

/**
 * Handle all the framework data types.
 */
export class FrameworkDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${FrameworkContexts.ContextRoot}${FrameworkTypes.Urn}`,
			() => ({
				context: FrameworkContexts.ContextRoot,
				type: FrameworkTypes.Urn,
				defaultValue: "",
				jsonSchema: async () => URNSchema as IJsonSchema,
				validate: async (propertyName, value, failures, container) =>
					Urn.validate(propertyName, value, failures)
			})
		);

		DataTypeHandlerFactory.register(
			`${FrameworkContexts.ContextRoot}${FrameworkTypes.TimestampMilliseconds}`,
			() => ({
				context: FrameworkContexts.ContextRoot,
				type: FrameworkTypes.TimestampMilliseconds,
				defaultValue: Date.now(),
				jsonSchema: async () => TimestampMillisecondsSchema as IJsonSchema,
				validate: async (propertyName, value, failures, container) =>
					Validation.timestampMilliseconds(propertyName, value, failures)
			})
		);

		DataTypeHandlerFactory.register(
			`${FrameworkContexts.ContextRoot}${FrameworkTypes.TimestampSeconds}`,
			() => ({
				context: FrameworkContexts.ContextRoot,
				type: FrameworkTypes.TimestampSeconds,
				defaultValue: Math.floor(Date.now() / 1000),
				jsonSchema: async () => TimestampSecondsSchema as IJsonSchema,
				validate: async (propertyName, value, failures, container) =>
					Validation.timestampSeconds(propertyName, value, failures)
			})
		);
	}
}
