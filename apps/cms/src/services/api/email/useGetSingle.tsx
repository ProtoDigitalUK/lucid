import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { EmailResT } from "@lucid/types/src/email";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    email_id: Accessor<number | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        email_id: helpers.resolveValue(params.queryParams?.location?.email_id),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["email.getSingle", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<EmailResT>>({
        url: `/api/v1/emails/${queryParams().location.email_id}`,
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
