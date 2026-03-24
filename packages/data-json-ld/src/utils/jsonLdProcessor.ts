// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, GeneralError, Is, ObjectHelper, SharedStore } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import {
	FetchHelper,
	HeaderHelper,
	HeaderTypes,
	HttpLinkRelType,
	HttpMethod,
	HttpStatusCode,
	MimeTypes
} from "@twin.org/web";
import jsonLd from "jsonld";
import type { JsonLd, RemoteDocument, Url } from "jsonld/jsonld-spec.js";
import type { IJsonLdContextDefinition } from "../models/IJsonLdContextDefinition.js";
import type { IJsonLdContextDefinitionElement } from "../models/IJsonLdContextDefinitionElement.js";
import type { IJsonLdContextDefinitionRoot } from "../models/IJsonLdContextDefinitionRoot.js";
import type { IJsonLdNodeObject } from "../models/IJsonLdNodeObject.js";

/**
 * JSON-LD Processor.
 */
export class JsonLdProcessor {
	/**
	 * The class name.
	 * @internal
	 */
	public static readonly CLASS_NAME = nameof<JsonLdProcessor>();

	/**
	 * Maximum number of HTTP Link-header discovery hops (namespace URL → context document).
	 * @internal
	 */
	private static readonly _MAX_LINK_DISCOVERY_DEPTH = 1;

	/**
	 * The document loader to use.
	 * @param documentLoader The document loader to use.
	 */
	public static setDocumentLoader(documentLoader: (url: Url) => Promise<RemoteDocument>): void {
		SharedStore.set("jsonLdDocumentLoader", documentLoader);
	}

	/**
	 * The document loader to use for retrieving JSON-LD documents.
	 * @returns The document loader.
	 */
	public static getDocumentLoader(): (url: Url) => Promise<RemoteDocument> {
		let documentLoader =
			SharedStore.get<(url: Url) => Promise<RemoteDocument>>("jsonLdDocumentLoader");
		if (!Is.function(documentLoader)) {
			documentLoader = async (url: string) => JsonLdProcessor.documentLoader(url);
		}
		return documentLoader;
	}

	/**
	 * Set the cache time limit for documents.
	 * @param cacheLimitMs The cache limit in milliseconds.
	 */
	public static setCacheLimit(cacheLimitMs: number): void {
		SharedStore.set("jsonLdDocumentCacheLimit", cacheLimitMs);
	}

	/**
	 * Get the cache limit for documents.
	 * @returns The document loader.
	 */
	public static getCacheLimit(): number {
		let cacheLimitMs = SharedStore.get<number>("jsonLdDocumentCacheLimit");
		if (Is.empty(cacheLimitMs)) {
			cacheLimitMs = 3600000;
			SharedStore.set("jsonLdDocumentCacheLimit", cacheLimitMs);
		}
		return cacheLimitMs;
	}

	/**
	 * Replace the global redirect list (use {@link JsonLdProcessor.addRedirect} to append without replacing).
	 * Redirects run before any HTTP GET or `Link` discovery; use them for stable overrides, tests, or hosts that do not expose a suitable `Link` header.
	 * @param redirects The redirects to use.
	 */
	public static setRedirects(
		redirects: {
			from: RegExp;
			to: string;
		}[]
	): void {
		SharedStore.set("jsonLdRedirects", redirects);
	}

	/**
	 * Get the global redirects for JSON-LD.
	 * @returns The registered redirects.
	 */
	public static getRedirects(): {
		from: RegExp;
		to: string;
	}[] {
		let redirects = SharedStore.get<
			{
				from: RegExp;
				to: string;
			}[]
		>("jsonLdRedirects");
		if (Is.empty(redirects)) {
			redirects = [];
			SharedStore.set("jsonLdRedirects", redirects);
		}
		return redirects;
	}

	/**
	 * Append a redirect rule (ignored if the same `RegExp.source` is already registered).
	 * Optional when the vocabulary URL supports HTTP `Link` discovery (`rel` includes `alternate`, `type` is `application/ld+json`) via the default document loader.
	 * Standards packages often expose `registerRedirects()` helpers that call this method; those are optional for the same reason.
	 * @param from The URL to redirect from.
	 * @param to The URL to redirect to.
	 */
	public static addRedirect(from: RegExp, to: string): void {
		const redirects = JsonLdProcessor.getRedirects();
		if (!redirects.some(r => r.from.source === from.source)) {
			redirects.push({ from, to });
		}
	}

	/**
	 * Compact a document according to a particular context.
	 * @param document The JSON-LD document to compact.
	 * @param context The context to compact the document to, if not provided will use the one in the document.
	 * @param options The options for compacting the document.
	 * @param options.itemListOverride Whether to override the itemListElement context with a set, defaults to true.
	 * @returns The compacted JSON-LD document.
	 */
	public static async compact<T>(
		document: T,
		context?: IJsonLdContextDefinitionRoot,
		options?: { itemListOverride: boolean }
	): Promise<T> {
		try {
			if (Is.object<IJsonLdNodeObject>(document)) {
				// If the user didn't provide a context, use the one from the document
				if (Is.empty(context) && !Is.empty(document["@context"])) {
					context = document["@context"];
				}

				const overrideListElementOption = options?.itemListOverride ?? true;
				let overrideContext: IJsonLdContextDefinitionElement | undefined;

				if (overrideListElementOption) {
					// The compactArrays flag doesn't work with the current version of jsonld.js
					// For list results we standardise on ItemList and itemListElement
					// so we modify the schema.org type for itemListElement to be a set which bypasses the issue
					// https://github.com/digitalbazaar/jsonld.js/issues/247
					overrideContext = {
						itemListElement: {
							"@id": "http://schema.org/itemListElement",
							"@container": "@set",
							"@protected": true
						}
					};

					if (Is.object(context) && "@context" in context) {
						// If the context is an object, we need to merge it with the override context
						context = JsonLdProcessor.combineContexts(
							context["@context"] as IJsonLdContextDefinitionRoot,
							overrideContext
						);
					} else {
						// If the context is a string or an array, we need to merge it with the override context
						context = JsonLdProcessor.combineContexts(context, overrideContext);
					}
				}

				const compacted = await jsonLd.compact(
					ObjectHelper.removeEmptyProperties(document),
					context as IJsonLdContextDefinition,
					{
						documentLoader: JsonLdProcessor.getDocumentLoader()
					}
				);

				if (!Is.empty(overrideContext)) {
					// Remove the override context from the compacted document
					compacted["@context"] = JsonLdProcessor.removeContexts(
						compacted["@context"] as IJsonLdContextDefinitionRoot,
						[overrideContext]
					);
				}

				return compacted as T;
			}
			return document;
		} catch (err) {
			JsonLdProcessor.handleCommonErrors(err);

			throw new GeneralError(JsonLdProcessor.CLASS_NAME, "compact", undefined, err);
		}
	}

	/**
	 * Expand a document, removing its context.
	 * @param compacted The compacted JSON-LD document to expand.
	 * @returns The expanded JSON-LD document.
	 */
	public static async expand<T>(compacted: T): Promise<IJsonLdNodeObject[]> {
		try {
			if (Is.object<IJsonLdNodeObject>(compacted)) {
				const expanded = await jsonLd.expand(ObjectHelper.removeEmptyProperties(compacted), {
					documentLoader: JsonLdProcessor.getDocumentLoader()
				});
				return expanded;
			}
			return [];
		} catch (err) {
			JsonLdProcessor.handleCommonErrors(err);

			throw new GeneralError(JsonLdProcessor.CLASS_NAME, "expand", undefined, err);
		}
	}

	/**
	 * Canonize a document.
	 * @param document The document to canonize.
	 * @param options The options for canonization.
	 * @param options.algorithm The algorithm to use for canonization, defaults to URDNA2015.
	 * @returns The canonized document.
	 */
	public static async canonize<T extends IJsonLdNodeObject>(
		document: T,
		options?: {
			algorithm?: "URDNA2015" | "URGNA2012" | undefined;
		}
	): Promise<string> {
		try {
			const normalized = await jsonLd.canonize(ObjectHelper.removeEmptyProperties(document), {
				algorithm: options?.algorithm ?? "URDNA2015",
				format: "application/n-quads",
				documentLoader: JsonLdProcessor.getDocumentLoader()
			});
			return normalized;
		} catch (err) {
			JsonLdProcessor.handleCommonErrors(err);

			throw new GeneralError(JsonLdProcessor.CLASS_NAME, "canonize", undefined, err);
		}
	}

	/**
	 * Combine contexts.
	 * @param context1 The first JSON-LD context to combine.
	 * @param context2 The second JSON-LD context to combine.
	 * @returns The combined context.
	 */
	public static combineContexts(
		context1: IJsonLdContextDefinitionRoot | undefined,
		context2: IJsonLdContextDefinitionRoot | undefined
	): IJsonLdContextDefinitionRoot | undefined {
		const combinedContext: IJsonLdContextDefinitionRoot = [];

		if (Is.string(context1)) {
			if (!combinedContext.includes(context1)) {
				combinedContext.push(context1);
			}
		} else if (Is.array(context1)) {
			for (const context of context1) {
				const hasMatch = combinedContext.some(c => ObjectHelper.equal(c, context));
				if (!hasMatch) {
					combinedContext.push(context);
				}
			}
		} else if (Is.object(context1)) {
			const hasMatch = combinedContext.some(c => ObjectHelper.equal(c, context1));
			if (!hasMatch) {
				combinedContext.push(context1);
			}
		}

		if (Is.string(context2)) {
			if (!combinedContext.includes(context2)) {
				combinedContext.push(context2);
			}
		} else if (Is.array(context2)) {
			for (const context of context2) {
				const hasMatch = combinedContext.some(c => ObjectHelper.equal(c, context));
				if (!hasMatch) {
					combinedContext.push(context);
				}
			}
		} else if (Is.object(context2)) {
			const hasMatch = combinedContext.some(c => ObjectHelper.equal(c, context2));
			if (!hasMatch) {
				combinedContext.push(context2);
			}
		}

		if (combinedContext.length === 0) {
			return null;
		}

		if (combinedContext.length === 1) {
			return combinedContext[0];
		}

		return combinedContext;
	}

	/**
	 * Gather all the contexts from the element and it's children.
	 * @param element The element to gather the contexts from.
	 * @param initial The initial context.
	 * @returns The combined contexts.
	 */
	public static gatherContexts<T>(
		element: T,
		initial?: IJsonLdContextDefinitionRoot
	): IJsonLdContextDefinitionRoot | undefined {
		let combinedContexts: IJsonLdContextDefinitionRoot | undefined = initial;

		if (Is.object<IJsonLdNodeObject>(element)) {
			if (!Is.empty(element["@context"])) {
				combinedContexts = JsonLdProcessor.combineContexts(
					initial,
					element["@context"] as IJsonLdContextDefinitionRoot
				);
			}

			for (const prop of Object.keys(element)) {
				const value = element[prop];
				if (Is.object(value)) {
					combinedContexts = JsonLdProcessor.gatherContexts(
						value as IJsonLdNodeObject,
						combinedContexts
					);
				} else if (Is.array(value)) {
					for (const item of value) {
						if (Is.object(item)) {
							combinedContexts = JsonLdProcessor.gatherContexts(
								item as IJsonLdNodeObject,
								combinedContexts
							);
						}
					}
				}
			}
		}

		return combinedContexts;
	}

	/**
	 * Remove all the contexts that match the pattern.
	 * @param context The context to remove the entries from.
	 * @param match The element to try and match.
	 * @returns The updated contexts.
	 */
	public static removeContexts(
		context: IJsonLdContextDefinitionRoot | undefined,
		match?: IJsonLdContextDefinitionElement[]
	): IJsonLdContextDefinitionRoot | undefined {
		if (!Is.arrayValue(match)) {
			return context;
		}

		let finalContext: IJsonLdContextDefinitionRoot | undefined;
		if (Is.string(context)) {
			for (const m of match) {
				if (context === m) {
					break;
				}
			}
		} else if (Is.array(context)) {
			for (const item of context) {
				const hasMatch = match.some(m => ObjectHelper.equal(m, item));
				if (!hasMatch) {
					finalContext ??= [];
					if (Is.array(finalContext)) {
						finalContext.push(item);
					}
				}
			}
		} else if (Is.object(context)) {
			const hasMatch = match.some(m => ObjectHelper.equal(m, context));
			if (!hasMatch) {
				finalContext = context;
			}
		}

		return Is.arrayValue(finalContext) && finalContext.length === 1
			? finalContext[0]
			: finalContext;
	}

	/**
	 * Add a context directly to the document loader cache.
	 * @param url The url the ld context is for.
	 * @param ldContext The context to add.
	 * @returns Nothing.
	 */
	public static async documentCacheAdd(url: string, ldContext: unknown): Promise<void> {
		await FetchHelper.setCacheEntry(url, ldContext);
	}

	/**
	 * Remove a context from the document loader cache.
	 * @param url The url the ld context is for.
	 * @returns Nothing.
	 */
	public static async documentCacheRemove(url: string): Promise<void> {
		FetchHelper.removeCacheEntry(url);
	}

	/**
	 * Document loader which uses a caching mechanism.
	 * @param url The document url to load.
	 * @returns The document.
	 * @internal
	 */
	private static async documentLoader(url: Url): Promise<RemoteDocument> {
		const redirects = JsonLdProcessor.getRedirects();
		for (const redirect of redirects) {
			if (redirect.from.test(url)) {
				url = redirect.to;
				break;
			}
		}

		return JsonLdProcessor.fetchRemoteJsonLdDocument(url, 0);
	}

	/**
	 * True when FetchHelper failed to decode JSON from the response (e.g. HTML or plain text).
	 * @param err The error from fetchJson.
	 * @internal
	 */
	private static isFetchJsonDecodeFailure(err: unknown): boolean {
		// Raw JSON.parse / response.json() failures (FetchHelper may rethrow as FetchError with cause,
		// or propagate SyntaxError when error-response body is not JSON).
		const error = BaseError.fromError(err);
		if (error.name === "SyntaxError" || error.cause?.name === "SyntaxError") {
			return true;
		}
		return error.message.includes("decodingJSON") || error.message.includes("is not valid JSON");
	}

	/**
	 * Use HTTP Link (rel=alternate, type=application/ld+json) to discover a JSON-LD context URL.
	 * @param sourceUrl URL that did not yield JSON (e.g. vocabulary namespace HTML page).
	 * @returns Absolute context document URL, or undefined.
	 * @internal
	 */
	private static async tryDiscoverAlternateJsonLdContextUrl(
		sourceUrl: string
	): Promise<string | undefined> {
		const fetchOpts = {
			timeoutMs: 30_000,
			headers: {
				[HeaderTypes.Accept]: `${MimeTypes.JsonLd},${MimeTypes.Json};q=0.9,*/*;q=0.8`
			}
		};

		let response = await FetchHelper.fetch(
			JsonLdProcessor.CLASS_NAME,
			sourceUrl,
			HttpMethod.HEAD,
			undefined,
			fetchOpts
		);

		if (
			response.status === HttpStatusCode.methodNotAllowed ||
			response.status === HttpStatusCode.notImplemented
		) {
			response = await FetchHelper.fetch(
				JsonLdProcessor.CLASS_NAME,
				sourceUrl,
				HttpMethod.GET,
				undefined,
				fetchOpts
			);
			await response.arrayBuffer();
		}

		if (!response.ok) {
			return undefined;
		}

		const linkHeader = response.headers.get(HeaderTypes.Link);
		if (Is.empty(linkHeader)) {
			return undefined;
		}

		// response.url is "" for many mocked/synthetic Responses; Is.empty("") is false, but
		// new URL(absoluteHref, "") throws — use a non-empty resolved URL as base only.
		const baseUrl = Is.stringValue(response.url) ? response.url : sourceUrl;

		const alternateLinkHeaders = HeaderHelper.extractLinkHeaderRelations(
			linkHeader,
			HttpLinkRelType.alternate
		);

		if (Is.arrayValue(alternateLinkHeaders)) {
			for (const alternateLinkHeader of alternateLinkHeaders) {
				if (alternateLinkHeader.params?.type === MimeTypes.JsonLd) {
					try {
						return new URL(alternateLinkHeader.url, baseUrl).href;
					} catch {
						// Malformed URL for this segment; try the next Link segment.
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Fetch a remote JSON-LD document, with Accept fallbacks and optional Link-header discovery.
	 * @param url Resolved document URL.
	 * @param linkDiscoveryDepth Current discovery recursion depth.
	 * @internal
	 */
	private static async fetchRemoteJsonLdDocument(
		url: string,
		linkDiscoveryDepth: number
	): Promise<RemoteDocument> {
		const cacheTtlMs = JsonLdProcessor.getCacheLimit();
		const fetchJsonLdOptions = {
			cacheTtlMs,
			headers: {
				[HeaderTypes.Accept]: MimeTypes.JsonLd
			}
		};
		const fetchJsonOptions = {
			cacheTtlMs,
			headers: {
				[HeaderTypes.Accept]: MimeTypes.Json
			}
		};

		try {
			const document = await FetchHelper.fetchJson<never, JsonLd>(
				JsonLdProcessor.CLASS_NAME,
				url,
				HttpMethod.GET,
				undefined,
				fetchJsonLdOptions
			);
			return {
				documentUrl: url,
				document
			};
		} catch (errLd) {
			if (JsonLdProcessor.isFetchJsonDecodeFailure(errLd)) {
				try {
					const document = await FetchHelper.fetchJson<never, JsonLd>(
						JsonLdProcessor.CLASS_NAME,
						url,
						HttpMethod.GET,
						undefined,
						fetchJsonOptions
					);
					return {
						documentUrl: url,
						document
					};
				} catch (errJson) {
					if (
						linkDiscoveryDepth < JsonLdProcessor._MAX_LINK_DISCOVERY_DEPTH &&
						JsonLdProcessor.isFetchJsonDecodeFailure(errJson)
					) {
						const discovered = await JsonLdProcessor.tryDiscoverAlternateJsonLdContextUrl(url);
						if (Is.stringValue(discovered) && discovered !== url) {
							return JsonLdProcessor.fetchRemoteJsonLdDocument(discovered, linkDiscoveryDepth + 1);
						}
					}
					throw errJson;
				}
			}
			throw errLd;
		}
	}

	/**
	 * Handle common errors.
	 * @param err The error to handle.
	 * @internal
	 */
	private static handleCommonErrors(err: unknown): void {
		if (
			Is.object<{ name: string; details?: { url?: string } }>(err) &&
			err.name === "jsonld.InvalidUrl"
		) {
			throw new GeneralError(
				JsonLdProcessor.CLASS_NAME,
				"invalidUrl",
				{ url: err.details?.url },
				err
			);
		} else if (
			Is.object<{ name: string; details?: { code: string } & { [id: string]: unknown } }>(err) &&
			err.name.startsWith("jsonld.")
		) {
			const { code, ...other } = err.details ?? {};
			throw new GeneralError(JsonLdProcessor.CLASS_NAME, "jsonLdError", { code, ...other }, err);
		}
	}
}
