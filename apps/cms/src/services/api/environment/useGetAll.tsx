import { createEffect, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// State
import { syncEnvironment } from "@/state/environment";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface QueryParams {}

const useGetAll = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  const query = createQuery(
    () => ["environment.getAll", queryKey(), params.key?.()],
    {
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
    }
  );

  // Effects
  createEffect(() => {
    if (query.isSuccess) {
      syncEnvironment(query.data?.data);
    }
  });

  return query;
};

export default useGetAll;
