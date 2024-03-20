import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse } from "@/types/api";
import type { SinglePagesResT } from "@headless/types/src/multiple-page";

interface QueryParams {
	location: {
		collection_key?: Accessor<string | undefined> | string;
	};
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() => {
		return serviceHelpers.getQueryParams<QueryParams>(params.queryParams);
	});
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: [
			"environment.collections.singlePages.getSingle",
			queryKey(),
			params.key?.(),
		],
		queryFn: () =>
			request<APIResponse<SinglePagesResT>>({
				url: `/api/v1/single-page/${
					queryParams().location?.collection_key
				}`,
				query: queryParams(),
				config: {
					method: "GET",
				},
			}),
		get enabled() {
			return params.enabled ? params.enabled() : true;
		},
		refetchOnWindowFocus: params.refetchOnWindowFocus,
	}));
};

export default useGetSingle;
