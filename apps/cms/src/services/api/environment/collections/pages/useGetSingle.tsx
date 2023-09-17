import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { CollectionPagesResT } from "@lucid/types/src/collections";

interface QueryParams {
  location: {
    id?: Accessor<number | undefined> | number;
  };
  includes: {
    bricks: Accessor<boolean | undefined> | boolean;
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
  return createQuery(
    () => [
      "environment.collections.pages.getSingle",
      queryKey(),
      params.key?.(),
    ],
    {
      queryFn: () =>
        request<APIResponse<CollectionPagesResT>>({
          url: `/api/v1/pages/${queryParams().location?.id}`,
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

export default useGetSingle;
