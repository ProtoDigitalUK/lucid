import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@protoheadless/core/types";
import type { SingleBuilderResT } from "@headless/types/src/multiple-builder";

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
			"collections.singleBuilder.getSingle",
			queryKey(),
			params.key?.(),
		],
		queryFn: () =>
			request<ResponseBody<SingleBuilderResT>>({
				url: `/api/v1/collections/single-builder/${
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
