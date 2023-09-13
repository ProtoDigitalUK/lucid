import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Store
import { environment } from "@/store/environmentStore";
// Types
import { APIResponse } from "@/types/api";
import { CollectionResT } from "@lucid/types/src/collections";

interface QueryParams {
  location: {
    collection_key?: Accessor<string | undefined> | string;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        collection_key: helpers.resolveValue(
          params.queryParams.location.collection_key
        ),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(
    () => ["environment.collections.getSingle", queryKey(), params.key?.()],
    {
      queryFn: () =>
        request<APIResponse<CollectionResT>>({
          url: `/api/v1/collections/${queryParams().location.collection_key}`,
          config: {
            method: "GET",
            headers: {
              "lucid-environment": environment() as string,
            },
          },
        }),
      get enabled() {
        return params.enabled ? params.enabled() : true;
      },
    }
  );
};

export default useGetSingle;
