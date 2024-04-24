// TODO: remove service

import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@protoheadless/core/types";
import type { CategoryResT } from "@headless/types/src/categories";

interface QueryParams {
	queryString?: Accessor<string>;
	filters?: {
		title?: Accessor<string | undefined> | string;
		collection_key?: Accessor<string | undefined> | string;
	};
	perPage?: Accessor<number> | number;
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
		queryKey: [
			"collections.categories.getMultiple",
			queryKey(),
			params.key?.(),
		],
		queryFn: () =>
			request<ResponseBody<CategoryResT[]>>({
				url: "/api/v1/collections/categories",
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
