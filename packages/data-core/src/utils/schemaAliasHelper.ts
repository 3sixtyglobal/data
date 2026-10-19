// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { Is, SharedStore } from "@3sixty/core";

/**
 * Helper for aliasing schema URLs, e.g. when schemas move to a new domain.
 */
export class SchemaAliasHelper {
	/**
	 * Replace the global alias list (use addAlias to append without replacing).
	 * @param aliases The aliases to use.
	 */
	public static setAliases(
		aliases: {
			from: RegExp | string;
			to: string;
		}[]
	): void {
		SharedStore.set("schemaAliases", aliases);
	}

	/**
	 * Get the global schema aliases.
	 * @returns The registered aliases.
	 */
	public static getAliases(): {
		from: RegExp | string;
		to: string;
	}[] {
		return SharedStore.get<
			{
				from: RegExp | string;
				to: string;
			}[]
		>("schemaAliases", () => []);
	}

	/**
	 * Append an alias (ignored if the same string or RegExp.source is already registered).
	 * A string is matched as a literal prefix and replaced with to as-is.
	 * A RegExp should normally be anchored with ^, to can use $1, $&lt;name&gt; and $&amp; replacements, sticky (y) patterns are not supported.
	 * @param from The prefix or pattern to alias from e.g. https://old.example/ or /^https:\/\/old\.example\//
	 * @param to The replacement e.g. https://new.example/
	 */
	public static addAlias(from: RegExp | string, to: string): void {
		const aliases = SchemaAliasHelper.getAliases();
		const exists = aliases.some(a => {
			if (Is.string(from)) {
				return Is.string(a.from) && a.from === from;
			}
			return !Is.string(a.from) && a.from.source === from.source;
		});
		if (!exists) {
			aliases.push({ from, to });
		}
	}

	/**
	 * Resolve a type name or URL using the first matching alias.
	 * @param value The type name or URL to resolve.
	 * @returns The aliased value, or the original value if no alias matches.
	 */
	public static resolve(value: string): string {
		for (const alias of SchemaAliasHelper.getAliases()) {
			if (Is.string(alias.from)) {
				if (value.startsWith(alias.from)) {
					return `${alias.to}${value.slice(alias.from.length)}`;
				}
			} else {
				const resolved = value.replace(alias.from, alias.to);
				if (resolved !== value) {
					return resolved;
				}
			}
		}
		return value;
	}
}
