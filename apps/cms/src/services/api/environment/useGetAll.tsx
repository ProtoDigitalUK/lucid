import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface QueryParams {}

const useGetAll = (params: {
  queryParams?: QueryParams;
  enabled?: () => boolean;
}) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const key = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["environments.getAll", key()], {
    queryFn: () =>
      request<APIResponse<EnvironmentResT[]>>({
        url: `/api/v1/environments`,
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
