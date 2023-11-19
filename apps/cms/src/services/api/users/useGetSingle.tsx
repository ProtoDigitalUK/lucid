import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { UserResT } from "@lucid/types/src/users";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    user_id: Accessor<number | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params?.queryParams || {})
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(() => ({
    queryKey: ["users.getSingle", queryKey(), params.key?.()],
    queryFn: () =>
      request<APIResponse<UserResT>>({
        url: `/api/v1/users/${queryParams().location?.user_id}`,
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  }));
};

export default useGetSingle;
