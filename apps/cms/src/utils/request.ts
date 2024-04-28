import queryBuilder, { type QueryBuilderProps } from "@/utils/query-builder";
import { HeadlessError, handleSiteErrors } from "@/utils/error-handling";
import type { ErrorResponse } from "@protoheadless/core/types";
import { csrfReq } from "@/services/api/auth/useCsrf";
import useRefreshToken from "@/services/api/auth/useRefreshToken";

export interface RequestParams<Data> {
	url: string;
	query?: QueryBuilderProps;
	csrf?: boolean;
	config?: RequestConfig<Data>;
}

interface RequestConfig<Data> {
	method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
	body?: Data | FormData;
	headers?: Record<string, string>;
}

export const getFetchURL = (url: string) => {
	if (!import.meta.env.PROD) {
		return `${import.meta.env.VITE_API_DEV_URL}${url}`;
	}
	return url;
};

const request = async <Response, Data = unknown>(
	params: RequestParams<Data>,
): Promise<Response> => {
	let fetchURL = getFetchURL(params.url);

	if (params.query) {
		const queryString = queryBuilder(params.query);
		if (queryString) {
			fetchURL = `${fetchURL}?${queryString}`;
		}
	}

	let csrfToken: string | null = null;
	if (params.csrf) csrfToken = await csrfReq();

	let body: string | undefined | FormData = undefined;
	if (params.config?.body !== undefined) {
		if (params.config.body instanceof FormData) {
			body = params.config.body;
		} else {
			body = JSON.stringify(params.config.body);
		}
	}

	const headers: Record<string, string> = params.config?.headers || {};
	if (typeof body === "string") {
		headers["Content-Type"] = "application/json";
	}
	if (csrfToken) headers._csrf = csrfToken;

	const fetchRes = await fetch(fetchURL, {
		method: params.config?.method,
		body,
		credentials: "include",
		headers: headers,
	});

	if (fetchRes.status === 401) {
		return await useRefreshToken(params);
	}
	if (fetchRes.status === 204) return {} as Response;

	const data = await fetchRes.json();
	if (!fetchRes.ok) {
		const errorObj = data as ErrorResponse;
		handleSiteErrors(errorObj);
		throw new HeadlessError(errorObj.message, errorObj);
	}

	return data as Response;
};

export default request;
