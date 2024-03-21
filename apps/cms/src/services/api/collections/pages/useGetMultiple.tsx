import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse } from "@/types/api";
import type { PagesResT } from "@headless/types/src/multiple-page";

interface QueryParams {
	queryString?: Accessor<string>;
	filters?: {
		collection_key?: Accessor<string | undefined> | string;
		title?: Accessor<string | undefined> | string;
		slug?: Accessor<string | undefined> | string;
		category_id?: Accessor<string[] | undefined> | string[];
	};
	headers: {
		"headless-content-lang": Accessor<number | undefined> | number;
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
			"environment.collections.pages.getMultiple",
			queryKey(),
			params.key?.(),
		],
		queryFn: () =>
			request<APIResponse<PagesResT[]>>({
				url: "/api/v1/collections/multiple-page",
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

export default useGetMultiple;
