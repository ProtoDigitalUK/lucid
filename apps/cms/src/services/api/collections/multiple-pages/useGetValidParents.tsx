import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse } from "@/types/api";
import type { MultipleBuilderResT } from "@headless/types/src/multiple-builder";

interface QueryParams {
	queryString?: Accessor<string>;
	location: {
		id?: Accessor<number | undefined> | number;
	};
	filters?: {
		collection_key?: Accessor<string | undefined> | string;
		title?: Accessor<string | undefined> | string;
	};
	headers: {
		"headless-content-lang": Accessor<number | undefined> | number;
	};
	perPage?: Accessor<number> | number;
}

const useGetValidParents = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: [
			"collections.multiplePages.getMultiple",
			queryKey(),
			params.key?.(),
		],
		queryFn: () =>
			request<APIResponse<MultipleBuilderResT[]>>({
				url: `/api/v1/collections/multiple-page/${
					queryParams().location?.id
				}/valid-parents`,
				query: queryParams(),
				config: {
					method: "GET",
					headers: queryParams().headers,
				},
			}),
		get enabled() {
			return params.enabled ? params.enabled() : true;
		},
	}));
};

export default useGetValidParents;
