import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { UserResT } from "@lucid/types/src/users";
import { APIResponse } from "@/types/api";

interface QueryParams {
  queryString?: Accessor<string>;
  filters?: {
    first_name?: Accessor<string>;
    last_name?: Accessor<string>;
    email?: Accessor<string>;
    username?: Accessor<string>;
  };
}

const useGetMultiple = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      queryString: helpers.resolveValue(params.queryParams?.queryString),
      filters: {
        first_name: helpers.resolveValue(
          params.queryParams?.filters?.first_name
        ),
        last_name: helpers.resolveValue(params.queryParams?.filters?.last_name),
        email: helpers.resolveValue(params.queryParams?.filters?.email),
        username: helpers.resolveValue(params.queryParams?.filters?.username),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["users.getMultiple", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<UserResT[]>>({
        url: `/api/v1/users`,
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
