// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, GeneralError, Guards, SharedStore } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";

/**
 * Helper for aliasing schema URLs, e.g. when schemas move to a new domain.
 * An alias from is either a literal prefix, or a regular expression pattern when it starts with / e.g. /^https:\/\/old\.example\//i
 * Aliases are plain strings so they can be serialised, e.g. in engine clone data.
 */
export class SchemaAliasHelper {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<SchemaAliasHelper>();

	/**
	 * Replace the global alias list (use addAlias to append without replacing).
	 * @param aliases The aliases to use.
	 * @throws GeneralError if a pattern is not a valid regular expression.
	 */
	public static setAliases(
		aliases: {
			from: string;
			to: string;
		}[]
	): void {
		Guards.array(SchemaAliasHelper.CLASS_NAME, nameof(aliases), aliases);
		for (const alias of aliases) {
			SchemaAliasHelper.verifyAlias(alias.from, alias.to);
		}
		SharedStore.set("schemaAliases", aliases);
	}

	/**
	 * Get the global schema aliases.
	 * @returns The registered aliases.
	 */
	public static getAliases(): {
		from: string;
		to: string;
	}[] {
		return SharedStore.get<
			{
				from: string;
				to: string;
			}[]
		>("schemaAliases", () => []);
	}

	/**
	 * Append an alias (ignored if the same from is already registered).
	 * A literal prefix is replaced with to as-is.
	 * A pattern should normally be anchored with ^, to can use $1, $&lt;name&gt; and $&amp; replacements, the sticky (y) flag is not supported.
	 * @param from The prefix or pattern to alias from e.g. https://old.example/ or /^https:\/\/old\.example\//
	 * @param to The replacement e.g. https://new.example/
	 * @throws GeneralError if the pattern is not a valid regular expression.
	 */
	public static addAlias(from: string, to: string): void {
		SchemaAliasHelper.verifyAlias(from, to);
		const aliases = SchemaAliasHelper.getAliases();
		if (!aliases.some(a => a.from === from)) {
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
			if (alias.from.startsWith("/")) {
				const resolved = value.replace(SchemaAliasHelper.getPattern(alias.from), alias.to);
				if (resolved !== value) {
					return resolved;
				}
			} else if (value.startsWith(alias.from)) {
				return `${alias.to}${value.slice(alias.from.length)}`;
			}
		}
		return value;
	}

	/**
	 * Verify an alias, compiling the pattern so an invalid one fails early.
	 * @param from The prefix or pattern to alias from.
	 * @param to The replacement.
	 * @throws GeneralError if the pattern is not a valid regular expression.
	 * @internal
	 */
	private static verifyAlias(from: string, to: string): void {
		Guards.stringValue(SchemaAliasHelper.CLASS_NAME, nameof(from), from);
		Guards.string(SchemaAliasHelper.CLASS_NAME, nameof(to), to);
		if (from.startsWith("/")) {
			SchemaAliasHelper.getPattern(from);
		}
	}

	/**
	 * Get the compiled regular expression for a pattern, caching it for later calls.
	 * @param pattern The pattern in the form /source/flags.
	 * @returns The compiled regular expression.
	 * @throws GeneralError if the pattern is not a valid regular expression.
	 * @internal
	 */
	private static getPattern(pattern: string): RegExp {
		const patterns = SharedStore.get<{ [pattern: string]: RegExp }>(
			"schemaAliasPatterns",
			() => ({})
		);
		let regExp = patterns[pattern];
		if (!regExp) {
			const flagsIndex = pattern.lastIndexOf("/");
			const flags = pattern.slice(flagsIndex + 1);
			if (flagsIndex === 0 || flags.includes("y")) {
				throw new GeneralError(SchemaAliasHelper.CLASS_NAME, "invalidPattern", { pattern });
			}
			try {
				regExp = new RegExp(pattern.slice(1, flagsIndex), flags);
			} catch (err) {
				throw new GeneralError(
					SchemaAliasHelper.CLASS_NAME,
					"invalidPattern",
					{ pattern },
					BaseError.fromError(err)
				);
			}
			patterns[pattern] = regExp;
		}
		return regExp;
	}
}
