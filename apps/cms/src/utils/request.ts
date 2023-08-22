// Utils
import queryBuilder, { QueryBuilderProps } from "@/utils/query-builder";
import { LucidError, handleSiteErrors } from "@/utils/error-handling";
// Types
import { APIErrorResponse } from "@/types/api";
// Services
import { csrfReq } from "@/services/api/auth/useCsrf";

interface RequestParams {
  url: string;
  query?: QueryBuilderProps;
  csrf?: boolean;
  config?: RequestConfig;
}

interface RequestConfig {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: {
    [key: string]: unknown;
  };
}

const request = async <Response>(params: RequestParams): Promise<Response> => {
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

  let body: string | undefined = undefined;
  if (params.config?.body !== undefined) {
    body = JSON.stringify(params.config.body);
  }

  const fetchRes = await fetch(fetchURL, {
    method: params.config?.method,
    body,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      _csrf: csrfToken || "",
    },
  });
  const data = await fetchRes.json();
  if (!fetchRes.ok) {
    const errorObj = data as APIErrorResponse;
    handleSiteErrors(errorObj);
    throw new LucidError(errorObj.message, errorObj);
  }

  return data as Response;
};

export default request;
