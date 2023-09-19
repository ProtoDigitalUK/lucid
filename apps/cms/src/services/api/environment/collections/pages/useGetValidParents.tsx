import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { CollectionPagesResT } from "@lucid/types/src/collections";

interface QueryParams {
  queryString?: Accessor<string>;
  location: {
    id?: Accessor<number | undefined> | number;
  };
  filters?: {
    collection_key?: Accessor<string | undefined> | string;
    title?: Accessor<string | undefined> | string;
  };
  headers: {
    "lucid-environment": Accessor<string | undefined> | string;
  };
  perPage?: Accessor<number> | number;
}

const useGetValidParents = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params.queryParams)
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(
    () => [
      "environment.collections.pages.getMultiple",
      queryKey(),
      params.key?.(),
    ],
    {
      queryFn: () =>
        request<APIResponse<CollectionPagesResT[]>>({
          url: `/api/v1/pages/${queryParams().location?.id}/valid-parents`,
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

export default useGetValidParents;
