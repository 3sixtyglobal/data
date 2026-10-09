// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@3sixty/core";
import { FetchHelper, HttpMethod } from "@3sixty/web";
import type { IJsonLdDocument } from "../../src/models/IJsonLdDocument.js";
import { JsonLdProcessor } from "../../src/utils/jsonLdProcessor.js";

describe("JsonLdProcessor Link header discovery", () => {
	const contextNs = "https://link-discovery.example.test/vocab";
	const contextDoc = "https://link-discovery.example.test/vocab/context.jsonld";

	const minimalContextDoc = {
		"@context": {
			Person: "http://schema.org/Person",
			name: "http://schema.org/name"
		}
	};

	// Compare URLs tolerating trailing-slash normalization from fetch / jsonld.
	function sameUrl(a: string, b: string): boolean {
		if (a === b) {
			return true;
		}
		try {
			return new URL(a).href === new URL(b).href;
		} catch {
			return false;
		}
	}

	function urlFromFetchInput(input: RequestInfo | URL): string {
		if (Is.string(input)) {
			return input;
		}
		if (input instanceof URL) {
			return input.href;
		}
		return input.url;
	}

	beforeEach(() => {
		FetchHelper.clearCache();
		JsonLdProcessor.setRedirects([]);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("discovers JSON-LD context via Link rel=alternate and loads document", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
				const url = urlFromFetchInput(input);
				const method = (init?.method ?? HttpMethod.GET).toUpperCase();

				if (method === HttpMethod.HEAD && sameUrl(url, contextNs)) {
					return new Response(null, {
						status: 200,
						headers: new Headers({
							link: `<${contextDoc}>; rel="alternate"; type="application/ld+json"`
						}),
						statusText: "OK"
					});
				}

				if (method === HttpMethod.GET && sameUrl(url, contextNs)) {
					return new Response("<!doctype html><title>Vocab</title>", {
						status: 200,
						headers: new Headers({
							"content-type": "text/html; charset=utf-8"
						})
					});
				}

				if (method === HttpMethod.GET && sameUrl(url, contextDoc)) {
					return new Response(JSON.stringify(minimalContextDoc), {
						status: 200,
						headers: new Headers({
							"content-type": "application/ld+json"
						})
					});
				}

				return new Response(JSON.stringify({ error: "not found" }), {
					status: 404,
					headers: new Headers({ "content-type": "application/json" })
				});
			})
		);

		const doc: IJsonLdDocument = {
			"@context": contextNs,
			"@type": "Person",
			name: "Ada"
		};

		const expanded = await JsonLdProcessor.expand(doc);
		expect(expanded[0]["http://schema.org/name"]).toEqual([{ "@value": "Ada" }]);
	});

	test("does not run Link discovery when GET fails with a non-decode error (e.g. 404)", async () => {
		const fetchMock = vi.fn(
			async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
				const url = urlFromFetchInput(input);
				const method = (init?.method ?? HttpMethod.GET).toUpperCase();

				if (method === HttpMethod.GET && sameUrl(url, contextNs)) {
					return new Response(JSON.stringify({ error: "not found" }), {
						status: 404,
						headers: new Headers({ "content-type": "application/json" })
					});
				}

				return new Response(JSON.stringify({ error: "not found" }), {
					status: 404,
					headers: new Headers({ "content-type": "application/json" })
				});
			}
		);
		vi.stubGlobal("fetch", fetchMock);

		const doc: IJsonLdDocument = {
			"@context": contextNs,
			"@type": "Person",
			name: "Ada"
		};

		await expect(JsonLdProcessor.expand(doc)).rejects.toThrow();
		expect(
			fetchMock.mock.calls.every(
				c => (c[1]?.method ?? HttpMethod.GET).toUpperCase() !== HttpMethod.HEAD
			)
		).toBe(true);
	});

	test("skips malformed alternate Link segment and uses a later valid segment", async () => {
		const badHref = "http://[";
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
				const url = urlFromFetchInput(input);
				const method = (init?.method ?? HttpMethod.GET).toUpperCase();

				if (method === HttpMethod.HEAD && sameUrl(url, contextNs)) {
					return new Response(null, {
						status: 200,
						headers: new Headers({
							link: `<${badHref}>; rel="alternate"; type="application/ld+json", <${contextDoc}>; rel="alternate"; type="application/ld+json"`
						}),
						statusText: "OK"
					});
				}

				if (method === HttpMethod.GET && sameUrl(url, contextNs)) {
					return new Response("<!doctype html><title>Vocab</title>", {
						status: 200,
						headers: new Headers({
							"content-type": "text/html; charset=utf-8"
						})
					});
				}

				if (method === HttpMethod.GET && sameUrl(url, contextDoc)) {
					return new Response(JSON.stringify(minimalContextDoc), {
						status: 200,
						headers: new Headers({
							"content-type": "application/ld+json"
						})
					});
				}

				return new Response(JSON.stringify({ error: "not found" }), {
					status: 404,
					headers: new Headers({ "content-type": "application/json" })
				});
			})
		);

		const doc: IJsonLdDocument = {
			"@context": contextNs,
			"@type": "Person",
			name: "Ada"
		};

		const expanded = await JsonLdProcessor.expand(doc);
		expect(expanded[0]["http://schema.org/name"]).toEqual([{ "@value": "Ada" }]);
	});

	test("registered redirect wins over Link header discovery", async () => {
		const redirectTarget = "https://redirect-override.example.test/forced-context.jsonld";
		JsonLdProcessor.addRedirect(/^https:\/\/link-discovery\.example\.test\/vocab$/, redirectTarget);

		const fetchMock = vi.fn(
			async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
				const url = urlFromFetchInput(input);
				const method = (init?.method ?? HttpMethod.GET).toUpperCase();

				if (method === HttpMethod.GET && sameUrl(url, redirectTarget)) {
					return new Response(JSON.stringify(minimalContextDoc), {
						status: 200,
						headers: new Headers({ "content-type": "application/ld+json" })
					});
				}

				if (sameUrl(url, contextNs)) {
					throw new Error(
						`unexpected ${method} to namespace URL - redirect should have replaced it: ${url}`
					);
				}

				return new Response(JSON.stringify({ error: "not found" }), {
					status: 404,
					headers: new Headers({ "content-type": "application/json" })
				});
			}
		);
		vi.stubGlobal("fetch", fetchMock);

		const doc: IJsonLdDocument = {
			"@context": contextNs,
			"@type": "Person",
			name: "Ada"
		};

		const expanded = await JsonLdProcessor.expand(doc);
		expect(expanded[0]["http://schema.org/name"]).toEqual([{ "@value": "Ada" }]);
		expect(
			fetchMock.mock.calls.some(
				c =>
					sameUrl(urlFromFetchInput(c[0]), redirectTarget) &&
					(c[1]?.method ?? HttpMethod.GET).toUpperCase() === HttpMethod.GET
			)
		).toBe(true);
	});

	test("does not recurse past one Link discovery hop", async () => {
		const hop1 = `${contextNs}/hop1`;
		const hop2 = `${contextNs}/hop2`;

		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
				const url = urlFromFetchInput(input);
				const method = (init?.method ?? HttpMethod.GET).toUpperCase();

				if (method === HttpMethod.HEAD && sameUrl(url, hop1)) {
					return new Response(null, {
						status: 200,
						headers: new Headers({
							link: `<${hop2}>; rel="alternate"; type="application/ld+json"`
						})
					});
				}
				if (method === HttpMethod.HEAD && sameUrl(url, hop2)) {
					return new Response(null, {
						status: 200,
						headers: new Headers({
							link: `<${contextDoc}>; rel="alternate"; type="application/ld+json"`
						})
					});
				}
				if (method === HttpMethod.GET && (sameUrl(url, hop1) || sameUrl(url, hop2))) {
					return new Response("<html></html>", {
						status: 200,
						headers: new Headers({ "content-type": "text/html" })
					});
				}
				if (method === HttpMethod.GET && sameUrl(url, contextDoc)) {
					return new Response(JSON.stringify(minimalContextDoc), {
						status: 200,
						headers: new Headers({
							"content-type": "application/ld+json"
						})
					});
				}
				return new Response(JSON.stringify({ error: "not found" }), {
					status: 404,
					headers: new Headers({ "content-type": "application/json" })
				});
			})
		);

		const doc: IJsonLdDocument = {
			"@context": hop1,
			"@type": "Person",
			name: "Ada"
		};

		await expect(JsonLdProcessor.expand(doc)).rejects.toThrow();
	});
});
