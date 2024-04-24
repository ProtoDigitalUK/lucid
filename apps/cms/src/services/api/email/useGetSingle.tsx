import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody, EmailResponse } from "@protoheadless/core/types";

interface QueryParams {
	location: {
		email_id: Accessor<number | undefined>;
	};
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: ["email.getSingle", queryKey(), params.key?.()],
		queryFn: () =>
			request<ResponseBody<EmailResponse>>({
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
