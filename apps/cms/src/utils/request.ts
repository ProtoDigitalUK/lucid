// Utils
import queryBuilder, { QueryBuilderProps } from "@/utils/query-builder";
import { HeadlessError, handleSiteErrors } from "@/utils/error-handling";
// Types
import { APIErrorResponse } from "@/types/api";
// Services
import { csrfReq } from "@/services/api/auth/useCsrf";

interface RequestParams<Data> {
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

const request = async <Response, Data = unknown>(
	params: RequestParams<Data>,
): Promise<Response> => {
	let fetchURL = params.url;
	if (!import.meta.env.PROD) {
		fetchURL = `${import.meta.env.VITE_API_DEV_URL}${params.url}`;
	}

	if (params.query) {
		const queryString = queryBuilder(params.query);
		if (queryString) {
			fetchURL = `${fetchURL}?${queryString}`;
		}
	}

	let csrfToken: string | null = null;
	if (params.csrf) {
		csrfToken = await csrfReq();
	}

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
	if (csrfToken) {
		headers._csrf = csrfToken;
	}

	const fetchRes = await fetch(fetchURL, {
		method: params.config?.method,
		body,
		credentials: "include",
		headers: headers,
	});
	if (fetchRes.status === 204) return {} as Response;

	const data = await fetchRes.json();
	if (!fetchRes.ok) {
		const errorObj = data as APIErrorResponse;
		handleSiteErrors(errorObj);
		throw new HeadlessError(errorObj.message, errorObj);
	}

	return data as Response;
};

export default request;
