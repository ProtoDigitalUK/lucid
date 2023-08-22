import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { FormResT } from "@lucid/types/src/forms";
import { APIResponse } from "@/types/api";

interface QueryParams {
  include: {
    fields: boolean;
  };
  filters?: {
    environment_key?: Accessor<string | undefined>;
  };
}

const useGetAll = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      include: [
        {
          key: "fields",
          include: params.queryParams.include.fields,
        },
      ],
      filters: {
        environment_key: helpers.resolveValue(
          params.queryParams.filters?.environment_key
        ),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(
    () => ["environment.forms.getAll", queryKey(), params.key?.()],
    {
      queryFn: () =>
        request<APIResponse<FormResT[]>>({
          url: `/api/v1/forms`,
          query: queryParams(),
          config: {
            method: "GET",
          },
        }),
      get enabled() {
        return params.enabled ? params.enabled() : true;
      },
    }
  );
};

export default useGetAll;
