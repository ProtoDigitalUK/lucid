import helpers from "@/utils/helpers";
import api from "@/services/api";
import queryBuilder, { QueryBuilderProps } from "@/utils/query-builder";
import { LucidError, handleSiteErrors } from "@/utils/error-handling";

interface RequestProps {
  url: string;
  query?: QueryBuilderProps;
  csrf?: boolean;
  config?: RequestInit;
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
      props?.config || {}
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
