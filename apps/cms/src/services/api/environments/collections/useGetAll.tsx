import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { APIResponse } from "@/types/api";
import { CollectionResT } from "@lucid/types/src/collections";

interface QueryParams {
  include: {
    bricks: boolean;
  };
  filters?: {
    environment_key?: Accessor<string | undefined>;
  };
}

const useGetAll = (params: {
  queryParams: QueryParams;
  enabled?: () => boolean;
}) => {
  const queryParams = createMemo(() => {
    return {
      include: [
        {
          key: "bricks",
          include: params.queryParams.include.bricks,
        },
      ],
      filters: {
        environment_key: helpers.resolveValue(
          params.queryParams.filters?.environment_key
        ),
      },
    };
  });

  const key = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["environments.collections.getAll", key()], {
    queryFn: () =>
      request<APIResponse<CollectionResT[]>>({
        url: `/api/v1/collections`,
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
