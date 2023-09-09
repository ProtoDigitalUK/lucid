import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { MediaResT } from "@lucid/types/src/media";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    id: Accessor<number | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        id: helpers.resolveValue(params.queryParams?.location?.id),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["media.getSingle", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<MediaResT>>({
        url: `/api/v1/media/${queryParams().location.id}`,
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
