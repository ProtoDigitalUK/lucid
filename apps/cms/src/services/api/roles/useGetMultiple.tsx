import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { RoleResT } from "@lucid/types/src/roles";
import { APIResponse } from "@/types/api";

interface QueryParams {
  queryString?: Accessor<string>;
  includes: {
    permissions: boolean;
  };
  filters?: {
    role_ids?: Accessor<number>;
    name?: Accessor<string>;
  };
}

const useGetMultiple = (params: {
  queryParams: QueryParams;
  enabled?: () => boolean;
}) => {
  const queryParams = createMemo(() => {
    return {
      queryString: helpers.resolveValue(params.queryParams?.queryString),
      includes: params.queryParams.includes,
      filters: {
        name: helpers.resolveValue(params.queryParams?.filters?.name),
        role_ids: helpers.resolveValue(params.queryParams?.filters?.role_ids),
      },
    };
  });

  const key = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["roles.getMultiple", key()], {
    queryFn: () =>
      request<APIResponse<RoleResT[]>>({
        url: `/api/v1/roles`,
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

export default useGetMultiple;
