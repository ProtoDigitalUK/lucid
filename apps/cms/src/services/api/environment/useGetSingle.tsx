import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface QueryParams {
  location: {
    environment_key: Accessor<string | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        environment_key: helpers.resolveValue(
          params.queryParams?.location?.environment_key
        ),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(
    () => ["environment.getSingle", queryKey(), params.key?.()],
    {
      queryFn: () =>
        request<APIResponse<EnvironmentResT>>({
          url: `/api/v1/environments/${queryParams().location.environment_key}`,
          config: {
            method: "GET",
          },
        }),
      get enabled() {
        return params.enabled ? params.enabled() : true;
      },
    }
  );
};

export default useGetSingle;
