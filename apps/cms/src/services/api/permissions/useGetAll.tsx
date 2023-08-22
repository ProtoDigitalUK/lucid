import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// Types
import { PermissionsResT } from "@lucid/types/src/permissions";
import { APIResponse } from "@/types/api";

interface QueryParams {}

const useGetAll = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["permissions.getAll", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<PermissionsResT>>({
        url: `/api/v1/permissions`,
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
