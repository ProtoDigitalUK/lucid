import queryBuilder, { type QueryBuilderProps } from "@/utils/query-builder";
import { LucidError, handleSiteErrors } from "@/utils/error-handling";
import type { ErrorResponse } from "@lucidcms/core/types";
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

export const getFetchURL = (url: string, query?: QueryBuilderProps): string => {
	let targetUrl = import.meta.env.PROD
		? url
		: `${import.meta.env.VITE_API_DEV_URL}${url}`;
	if (query) {
		targetUrl += `?${queryBuilder(query)}`;
	}
	return targetUrl;
};

const prepareRequestBody = <Data>(
	body?: Data | FormData,
): string | FormData | undefined => {
	if (!body) return undefined;
	return body instanceof FormData ? body : JSON.stringify(body);
};

const prepareHeaders = async (
	csrf?: boolean,
	headers: Record<string, string> = {},
	body?: string | FormData | undefined,
): Promise<Record<string, string>> => {
	const updatedHeaders = { ...headers };
	if (csrf) {
		const csrfToken = await csrfReq();
		if (csrfToken) updatedHeaders._csrf = csrfToken;
	}
	if (headers["Content-Type"] === undefined && typeof body === "string") {
		updatedHeaders["Content-Type"] = "application/json";
	}
	return updatedHeaders;
};

const handleResponse = async <ResponseBody, Data = unknown>(
	params: RequestParams<Data>,
	fetchRes: Response,
): Promise<ResponseBody> => {
	switch (fetchRes.status) {
		case 401: {
			return useRefreshToken(params);
		}
		case 403: {
			const data = (await fetchRes.json()) as ErrorResponse;
			if (data.code === "csrf") {
				sessionStorage.removeItem("_csrf");
				return await request(params);
			}
			break;
		}
		case 204: {
			return {} as ResponseBody;
		}
	}

	const data = await fetchRes.json();

	if (!fetchRes.ok) {
		const errorObj = data as ErrorResponse;
		handleSiteErrors(errorObj);
		throw new LucidError(errorObj.message, errorObj);
	}

	return data as ResponseBody;
};

const request = async <ResponseBody, Data = unknown>(
	params: RequestParams<Data>,
): Promise<ResponseBody> => {
	const fetchURL = getFetchURL(params.url, params.query);
	const body = prepareRequestBody(params.config?.body);
	const headers = await prepareHeaders(
		params.csrf,
		params.config?.headers,
		body,
	);

	const fetchRes = await fetch(fetchURL, {
		method: params.config?.method,
		credentials: "include",
		body: body,
		headers: headers,
	});

	return handleResponse(params, fetchRes);
};

export default request;
