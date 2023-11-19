import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { EmailResT } from "@lucid/types/src/email";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    email_id: Accessor<number | undefined>;
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
    queryKey: ["email.getSingle", queryKey(), params.key?.()],
    queryFn: () =>
      request<APIResponse<EmailResT>>({
        url: `/api/v1/emails/${queryParams().location?.email_id}`,
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
