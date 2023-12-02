import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { UserResT } from "@headless/types/src/users";
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
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params?.queryParams || {})
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(() => ({
    queryKey: ["users.getMultiple", queryKey(), params.key?.()],
    queryFn: () =>
      request<APIResponse<UserResT[]>>({
        url: `/api/v1/users`,
        query: queryParams(),
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params?.enabled ? params.enabled() : true;
    },
  }));
};

export default useGetMultiple;
