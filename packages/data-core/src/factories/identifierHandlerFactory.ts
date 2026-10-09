// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory, Urn } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
import type { IIdentifierHandler } from "../models/IIdentifierHandler.js";

/**
 * Factory for creating handlers for identifiers.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const IdentifierHandlerFactory = Factory.createFactory<IIdentifierHandler>(
	"namespace",
	false,
	(names: string[], uri: string) => {
		Urn.guard(nameof(IdentifierHandlerFactory), nameof(uri), uri);

		const urn = Urn.fromValidString(uri);
		const urnParts = urn.parts();

		for (let i = urnParts.length - 1; i >= 0; i--) {
			const wholeNamespace = urnParts.slice(i).join(":");
			if (names.includes(wholeNamespace)) {
				return wholeNamespace;
			}
		}
	}
);
