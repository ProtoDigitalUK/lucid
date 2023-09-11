import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { EmailResT } from "@lucid/types/src/email";
import { APIResponse } from "@/types/api";

interface QueryParams {
  queryString?: Accessor<string>;
  filters?: {
    to_address?: Accessor<number>;
    subject?: Accessor<string>;
    delivery_status?: Accessor<string[]>;
    type?: Accessor<string[]>;
    template?: Accessor<string>;
  };
  perPage?: number;
}

const useGetMultiple = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      queryString: helpers.resolveValue(params.queryParams?.queryString),
      filters: {
        to_address: helpers.resolveValue(
          params.queryParams?.filters?.to_address
        ),
        subject: helpers.resolveValue(params.queryParams?.filters?.subject),
        delivery_status: helpers.resolveValue(
          params.queryParams?.filters?.delivery_status
        ),
        type: helpers.resolveValue(params.queryParams?.filters?.type),
        template: helpers.resolveValue(params.queryParams?.filters?.template),
      },
      perPage: params.queryParams.perPage,
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["email.getMultiple", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<EmailResT[]>>({
        url: `/api/v1/emails`,
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
