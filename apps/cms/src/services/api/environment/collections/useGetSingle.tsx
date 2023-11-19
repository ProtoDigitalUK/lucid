import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { CollectionResT } from "@lucid/types/src/collections";

interface QueryParams {
  location: {
    collection_key?: Accessor<string | undefined> | string;
  };
  headers: {
    "lucid-environment": Accessor<string | undefined> | string;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params.queryParams)
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(() => ({
    queryKey: ["environment.collections.getSingle", queryKey(), params.key?.()],
    queryFn: () =>
      request<APIResponse<CollectionResT>>({
        url: `/api/v1/collections/${queryParams().location?.collection_key}`,
        config: {
          method: "GET",
          headers: queryParams().headers,
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  }));
};

export default useGetSingle;
