import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { RoleResT } from "@lucid/types/src/roles";
import { APIResponse } from "@/types/api";

interface QueryParams {
  queryString?: Accessor<string>;
  include: Record<"permissions", boolean>;
  filters?: {
    role_ids?: Accessor<number>;
    name?: Accessor<string>;
  };
  perPage?: number;
}

const useGetMultiple = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params.queryParams)
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(() => ({
    queryKey: ["roles.getMultiple", queryKey(), params.key?.()],
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
  }));
};

export default useGetMultiple;
