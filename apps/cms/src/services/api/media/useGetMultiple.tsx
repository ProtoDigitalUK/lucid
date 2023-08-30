import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { MediaResT } from "@lucid/types/src/media";
import { APIResponse } from "@/types/api";

interface QueryParams {
  queryString?: Accessor<string>;
  filters?: {
    name?: Accessor<string>;
    key?: Accessor<string>;
    mime_type: Accessor<string>;
    file_extension: Accessor<string>;
  };
  perPage?: number;
}

const useGetMultiple = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      queryString: helpers.resolveValue(params.queryParams?.queryString),
      filters: {
        name: helpers.resolveValue(params.queryParams?.filters?.name),
        key: helpers.resolveValue(params.queryParams?.filters?.key),
        mime_type: helpers.resolveValue(params.queryParams?.filters?.mime_type),
        file_extension: helpers.resolveValue(
          params.queryParams?.filters?.file_extension
        ),
      },
      perPage: params.queryParams.perPage,
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["roles.getMultiple", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<MediaResT[]>>({
        url: `/api/v1/media`,
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
