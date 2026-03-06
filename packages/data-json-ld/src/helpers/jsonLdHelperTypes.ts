// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionRoot } from "../models/IJsonLdContextDefinitionRoot.js";

/**
 * Extract the optional property names from a type.
 */
export type JsonLdOptionalKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Extract the required property names from a type.
 */
export type JsonLdRequiredKeys<T> = Exclude<keyof T, JsonLdOptionalKeys<T>>;

/**
 * Keep JSON-LD keys as-is and prefix non-JSON-LD keys.
 */
export type JsonLdAliasKey<K extends string, Prefix extends string> = K extends `@${string}`
	? K
	: `${Prefix}:${K}`;

/**
 * Remap an object type so JSON-LD keys ("@...") are preserved and
 * non-JSON-LD keys are exposed as `Prefix:key` aliases, while preserving
 * each key's original required/optional status.
 */
export type JsonLdWithAliases<T extends object, Prefix extends string> = {
	[K in Extract<JsonLdRequiredKeys<T>, string> as JsonLdAliasKey<K, Prefix>]: T[K];
} & {
	[K in Extract<JsonLdOptionalKeys<T>, string> as JsonLdAliasKey<K, Prefix>]?: T[K];
};

/**
 * Keep only JSON-LD keys ("@...") from a type.
 */
export type JsonLdKeys<T extends object> = Pick<T, Extract<keyof T, `@${string}`>>;

/**
 * Create a JSON-LD object shape containing only JSON-LD keys plus aliased
 * non-JSON-LD keys.
 */
export type JsonLdObjectWithAliases<T extends object, Prefix extends string> = JsonLdKeys<T> &
	JsonLdWithAliases<T, Prefix>;

/**
 * Add "@context" to a type.
 */
export type JsonLdObjectWithContext<T extends object, C = IJsonLdContextDefinitionRoot> = Omit<
	T,
	"@context"
> & {
	"@context": C;
};

/**
 * Infer an existing property's type from a source type, or fall back to a default.
 */
export type JsonLdExistingProperty<T extends object, P extends PropertyKey, D> = T extends {
	[K in P]?: infer PropertyType;
}
	? Exclude<PropertyType, undefined>
	: D;

/**
 * Infer an existing property's type from either of two source properties,
 * or fall back to a default when neither exists.
 */
export type JsonLdExistingPropertyEither<
	T extends object,
	P1 extends PropertyKey,
	P2 extends PropertyKey,
	D
> = [JsonLdExistingProperty<T, P1, never> | JsonLdExistingProperty<T, P2, never>] extends [never]
	? D
	: JsonLdExistingProperty<T, P1, never> | JsonLdExistingProperty<T, P2, never>;

/**
 * Add optional "@context" to a type, inferring an existing context type from
 * the source type when available, otherwise using the provided default.
 */
export type JsonLdObjectWithOptionalContext<
	T extends object,
	C = JsonLdExistingProperty<T, "@context", IJsonLdContextDefinitionRoot>
> = Omit<T, "@context"> & {
	"@context"?: C;
};

/**
 * Omit optional "@context" from a type, inferring an existing context type from
 * the source type when available, otherwise using the provided default.
 */
export type JsonLdObjectWithNoContext<T extends object> = Omit<T, "@context">;

/**
 * Add "type" to a type.
 */
export type JsonLdObjectWithType<
	T extends object,
	Ty = JsonLdExistingPropertyEither<T, "type", "@type", string | string[]>
> = Omit<T, "type" | "@type"> & {
	type: Ty;
};

/**
 * Add optional "type" to a type.
 */
export type JsonLdObjectWithOptionalType<
	T extends object,
	Ty = JsonLdExistingPropertyEither<T, "type", "@type", string | string[]>
> = Omit<T, "type" | "@type"> & {
	type?: Ty;
};

/**
 * Omit "type" from a type.
 */
export type JsonLdObjectWithNoType<T extends object> = Omit<T, "type">;

/**
 * Add "@type" to a type.
 */
export type JsonLdObjectWithAtType<
	T extends object,
	Ty = JsonLdExistingPropertyEither<T, "@type", "type", string | string[]>
> = Omit<T, "@type" | "type"> & {
	"@type": Ty;
};

/**
 * Add optional "@type" to a type.
 */
export type JsonLdObjectWithOptionalAtType<
	T extends object,
	Ty = JsonLdExistingPropertyEither<T, "@type", "type", string | string[]>
> = Omit<T, "@type" | "type"> & {
	"@type"?: Ty;
};

/**
 * Omit "@type" from a type.
 */
export type JsonLdObjectWithNoAtType<T extends object> = Omit<T, "@type">;

/**
 * Add "id" to a type.
 */
export type JsonLdObjectWithId<
	T extends object,
	Id = JsonLdExistingPropertyEither<T, "id", "@id", string>
> = Omit<T, "id" | "@id"> & {
	id: Id;
};

/**
 * Add optional "id" to a type.
 */
export type JsonLdObjectWithOptionalId<
	T extends object,
	Id = JsonLdExistingPropertyEither<T, "id", "@id", string>
> = Omit<T, "id" | "@id"> & {
	id?: Id;
};

/**
 * Omit "id" from a type.
 */
export type JsonLdObjectWithNoId<T extends object> = Omit<T, "id">;

/**
 * Add "@id" to a type.
 */
export type JsonLdObjectWithAtId<
	T extends object,
	Id = JsonLdExistingPropertyEither<T, "@id", "id", string>
> = Omit<T, "@id" | "id"> & {
	"@id": Id;
};

/**
 * Add optional "@id" to a type.
 */
export type JsonLdObjectWithOptionalAtId<
	T extends object,
	Id = JsonLdExistingPropertyEither<T, "@id", "id", string>
> = Omit<T, "@id" | "id"> & {
	"@id"?: Id;
};

/**
 * Omit "@id" from a type.
 */
export type JsonLdObjectWithNoAtId<T extends object> = Omit<T, "@id">;
