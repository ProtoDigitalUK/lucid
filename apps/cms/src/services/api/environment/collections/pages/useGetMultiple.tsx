import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Store
import { environment } from "@/store/environmentStore";
// Types
import { APIResponse } from "@/types/api";

interface QueryParams {
  filters?: {
    collection_key?: Accessor<string | undefined> | string;
    title?: Accessor<string | undefined> | string;
    slug?: Accessor<string | undefined> | string;
    category_id?: Accessor<string[] | undefined> | string[];
  };
}

const useGetMultiple = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      filters: {
        collection_key: helpers.resolveValue(
          params.queryParams.filters?.collection_key
        ),
        title: helpers.resolveValue(params.queryParams.filters?.title),
        slug: helpers.resolveValue(params.queryParams.filters?.slug),
        category_id: helpers.resolveValue(
          params.queryParams.filters?.category_id
        ),
      },
      headers: {
        "lucid-environment": helpers.resolveValue(environment) || "",
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(
    () => [
      "environment.collections.pages.getMultiple",
      queryKey(),
      params.key?.(),
    ],
    {
      queryFn: () =>
        request<APIResponse<Record<string, string>>>({
          url: `/api/v1/pages`,
          query: queryParams(),
          config: {
            method: "GET",
            headers: queryParams().headers,
          },
        }),
      get enabled() {
        return params.enabled ? params.enabled() : true;
      },
    }
  );
};

export default useGetMultiple;
