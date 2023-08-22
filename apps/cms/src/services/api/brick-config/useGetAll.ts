import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { APIResponse } from "@/types/api";
import { BrickConfigT } from "@lucid/types/src/bricks";

interface QueryParams {
  include: {
    fields: boolean;
  };
  filters?: {
    environment_key: Accessor<string | undefined>;
    collection_key: Accessor<string | undefined>;
  };
}

const useGetAll = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      include: [
        {
          key: "fields",
          include: params.queryParams.include.fields,
        },
      ],
      filters: {
        environment_key: helpers.resolveValue(
          params.queryParams.filters?.environment_key
        ),
        collection_key: helpers.resolveValue(
          params.queryParams.filters?.collection_key
        ),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["brickConfig.getAll", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<BrickConfigT[]>>({
        url: `/api/v1/bricks/config`,
        query: queryParams(),
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  });
};

export default useGetAll;
