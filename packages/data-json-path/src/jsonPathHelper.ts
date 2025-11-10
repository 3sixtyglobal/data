// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, GeneralError, Guards, Is } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import { jsonpath, type JSONValue } from "json-p3";
import type { IJsonPathResult } from "./models/IJsonPathResult.js";

/**
 * Helper class for JSONPath operations.
 * Provides abstraction over the json-p3 library.
 */
export class JsonPathHelper {
	/**
	 * The name of the class name of the JsonPathHelper class.
	 */
	public static readonly CLASS_NAME: string = nameof<JsonPathHelper>();

	/**
	 * Execute a JSONPath query and return results with values and locations.
	 * @param path The JSONPath query string (e.g., "$.store.book[*].title").
	 * @param data The data to query.
	 * @returns Array of results containing values and their locations.
	 * @throws GeneralError if the path is invalid or data cannot be queried.
	 */
	public static query(path: string, data: unknown): IJsonPathResult[] {
		Guards.stringValue(JsonPathHelper.CLASS_NAME, nameof(path), path);

		try {
			const results = jsonpath.query(path, data as JSONValue);
			// Convert JSONPathNodeList to array of IJsonPathResult
			const resultArray: IJsonPathResult[] = [];
			for (const node of results) {
				resultArray.push({
					value: node.value,
					location: node.location,
					path: node.getPath({ form: "canonical" })
				});
			}
			return resultArray;
		} catch (error) {
			throw new GeneralError(
				JsonPathHelper.CLASS_NAME,
				"query",
				{
					path
				},
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Check if a JSONPath exists in the data.
	 * @param path The JSONPath query string.
	 * @param data The data to check.
	 * @returns True if the path exists and returns at least one result.
	 */
	public static exists(path: string, data: unknown): boolean {
		Guards.stringValue(JsonPathHelper.CLASS_NAME, nameof(path), path);

		try {
			const results = jsonpath.query(path, data as JSONValue);
			return !results.empty();
		} catch {
			return false;
		}
	}

	/**
	 * Extract the first value from a JSONPath query.
	 * @param path The JSONPath query string.
	 * @param data The data to query.
	 * @returns The first matched value, or undefined if no matches.
	 * @throws GeneralError if the path is invalid or data cannot be queried.
	 */
	public static extractSingle(path: string, data: unknown): unknown {
		Guards.stringValue(JsonPathHelper.CLASS_NAME, nameof(path), path);

		try {
			const node = jsonpath.match(path, data as JSONValue);
			return node?.value;
		} catch (error) {
			throw new GeneralError(
				JsonPathHelper.CLASS_NAME,
				"extractSingleFailed",
				{
					path
				},
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Extract all values from a JSONPath query.
	 * @param path The JSONPath query string.
	 * @param data The data to query.
	 * @returns Array of all matched values.
	 * @throws GeneralError if the path is invalid or data cannot be queried.
	 */
	public static extractAll(path: string, data: unknown): unknown[] {
		Guards.stringValue(JsonPathHelper.CLASS_NAME, nameof(path), path);

		try {
			const results = jsonpath.query(path, data as JSONValue);
			return results.values();
		} catch (error) {
			throw new GeneralError(
				JsonPathHelper.CLASS_NAME,
				"extractAllFailed",
				{
					path
				},
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Validate if a JSONPath query is valid.
	 * @param path The JSONPath query string to validate.
	 * @returns True if the syntax is valid.
	 * @throws GeneralError if the path is invalid or data cannot be queried.
	 */
	public static validate(path: string): boolean {
		if (!Is.stringValue(path)) {
			return false;
		}

		try {
			// Query with empty object to test syntax
			jsonpath.query(path, {});
			return true;
		} catch (error) {
			throw new GeneralError(
				JsonPathHelper.CLASS_NAME,
				"validateFailed",
				{
					path
				},
				BaseError.fromError(error)
			);
		}
	}
}
