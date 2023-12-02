import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { PermissionsResT } from "@headless/types/src/permissions";
import { APIResponse } from "@/types/api";

interface QueryParams {}

const useGetAll = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params.queryParams)
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(() => ({
    queryKey: ["permissions.getAll", queryKey(), params.key?.()],
    queryFn: () =>
      request<APIResponse<PermissionsResT>>({
        url: `/api/v1/permissions`,
        query: queryParams(),
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  }));
};

export default useGetAll;
