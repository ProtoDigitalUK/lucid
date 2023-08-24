import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// Types
import { UserResT } from "@lucid/types/src/users";
import { APIResponse } from "@/types/api";

interface QueryParams {}

const useGetAuthenticatedUser = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["users.getSingle", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<UserResT>>({
        url: `/api/v1/auth/me`,
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  });
};

export default useGetAuthenticatedUser;
