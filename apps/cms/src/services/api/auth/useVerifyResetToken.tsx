import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    token: string;
  };
}

const useVerifyResetToken = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params.queryParams)
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(
    () => ["auth.verifyResetToken", queryKey(), params.key?.()],
    {
      queryFn: () =>
        request<
          APIResponse<{
            message: string;
          }>
        >({
          url: `/api/v1/auth/reset-password/${queryParams().location?.token}`,
          config: {
            method: "GET",
          },
        }),
      retry: 0,
      get enabled() {
        return params.enabled ? params.enabled() : true;
      },
    }
  );
};

export default useVerifyResetToken;
