import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    token: string;
  };
}

const useVerifyResetToken = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        token: params.queryParams?.location?.token,
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(
    () => ["auth.verifyResetToken", queryKey(), params.key?.()],
    {
      queryFn: () =>
        request<
          APIResponse<{
            message: string;
          }>
        >({
          url: `/api/v1/auth/reset-password/${queryParams().location.token}`,
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
