import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// Types
import { RoleResT } from "@lucid/types/src/roles";
import { APIResponse } from "@/types/api";

interface QueryParams {}

const useGetAll = (params: {
  queryParams: QueryParams;
  enabled?: () => boolean;
}) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const key = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["permissions.getAll", key()], {
    queryFn: () =>
      request<APIResponse<RoleResT[]>>({
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
