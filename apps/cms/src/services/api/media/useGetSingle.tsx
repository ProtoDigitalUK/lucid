import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { MediaResT } from "@headless/types/src/media";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    id: Accessor<number | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() =>
    serviceHelpers.getQueryParams<QueryParams>(params.queryParams)
  );
  const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

  // -----------------------------
  // Query
  return createQuery(() => ({
    queryKey: ["media.getSingle", queryKey(), params.key?.()],
    queryFn: () =>
      request<APIResponse<MediaResT>>({
        url: `/api/v1/media/${queryParams().location?.id}`,
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
