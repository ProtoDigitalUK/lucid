import helpers from "@/utils/helpers";
import { LucidError } from "@/utils/error-handling";

const request = async <Response>(
  url: string,
  config: RequestInit = {}
): Promise<Response> => {
  console.log(import.meta.env);

  let fetchURL = url;
  if (!import.meta.env.PROD) {
    fetchURL = `${import.meta.env.VITE_API_DEV_URL}${url}`;
  }

  const fetchRes = await fetch(
    fetchURL,
    helpers.deepMerge(
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
      config
    )
  );
  const data = await fetchRes.json();
  if (!fetchRes.ok) {
    const errorObj = data as APIErrorResponse;
    throw new LucidError(errorObj.message, errorObj);
  }

  return data as Response;
};

export default request;
