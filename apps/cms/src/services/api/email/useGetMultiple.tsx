import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { EmailResT } from "@headless/types/src/email";
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
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: ["email.getMultiple", queryKey(), params.key?.()],
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
	}));
};

export default useGetMultiple;
