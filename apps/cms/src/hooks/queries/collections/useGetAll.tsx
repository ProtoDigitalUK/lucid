import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import helpers from "@/utils/helpers";
// Services
import api from "@/services/api";
// Types
import { Params } from "@/services/api/environments/collections/get-all";

interface QueryParams {
  include: Params["include"];
  filters?: {
    environment_key?: Accessor<string | undefined>;
  };
}

export const useGetAll = (
  params: QueryParams,
  options?: {
    enabled?: boolean;
  }
) => {
  const propsData = createMemo(() => {
    return {
      include: params.include,
      filters: {
        environment_key: helpers.resolveValue(params.filters?.environment_key),
      },
    };
  });

  const key = createMemo(() => {
    return JSON.stringify(propsData());
  });

  return createQuery(() => ["environments.collections.getAll", key()], {
    queryFn: () => api.environments.collections.getAll(propsData()),
    get enabled() {
      return options?.enabled ?? true;
    },
  });
};
