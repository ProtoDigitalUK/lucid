import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { UserResT } from "@lucid/types/src/users";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    user_id: Accessor<number | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        user_id: helpers.resolveValue(params.queryParams?.location?.user_id),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["users.getSingle", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<UserResT>>({
        url: `/api/v1/users/${queryParams().location.user_id}`,
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  });
};

export default useGetSingle;
