import helpers from "@/utils/helpers";
import api from "@/services/api";
import queryBuilder, { QueryBuilderProps } from "@/utils/query-builder";
import {
  LucidError,
  handleSiteErrors,
  emptyBodyError,
} from "@/utils/error-handling";

interface RequestProps {
  url: string;
  query?: QueryBuilderProps;
  csrf?: boolean;
  config?: RequestConfig;
}

interface RequestConfig {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: {
    [key: string]: any;
  };
}

const request = async <Response>(props: RequestProps): Promise<Response> => {
  let fetchURL = props.url;
  if (!import.meta.env.PROD) {
    fetchURL = `${import.meta.env.VITE_API_DEV_URL}${props.url}`;
  }

  if (props.query) {
    const queryString = queryBuilder(props.query);
    if (queryString) {
      fetchURL = `${fetchURL}?${queryString}`;
    }
  }

  let csrfToken: string | undefined;
  if (props.csrf) {
    const csrfRes = await api.auth.csrf();
    csrfToken = csrfRes.data._csrf;
  }

  let body: string | undefined = undefined;
  if (props.config?.body !== undefined) {
    // if (
    //   Object.keys(props.config.body).length === 0 &&
    //   props.config.body.constructor === Object
    // ) {
    //   emptyBodyError();
    //   throw new LucidError("Empty body", {
    //     message: "Empty body",
    //     name: "Empty body",
    //     status: 400,
    //     errors: {},
    //   });
    // }
    body = JSON.stringify(props.config.body);
  }

  const fetchRes = await fetch(
    fetchURL,
    helpers.deepMerge(
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          _csrf: csrfToken || "",
        },
      },
      {
        method: props.config?.method,
        body,
      }
    )
  );
  const data = await fetchRes.json();
  if (!fetchRes.ok) {
    const errorObj = data as APIErrorResponse;
    handleSiteErrors(errorObj);
    throw new LucidError(errorObj.message, errorObj);
  }

  return data as Response;
};

export default request;
