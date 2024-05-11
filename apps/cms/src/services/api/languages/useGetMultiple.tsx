import { createEffect, createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
import contentLanguageStore from "@/store/contentLanguageStore";
import type { ResponseBody, LanguageResponse } from "@lucidcms/core/types";

interface QueryParams {
	queryString?: Accessor<string> | string;
	perPage?: Accessor<number> | number;
}

const useGetAll = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	const query = createQuery(() => ({
		queryKey: ["languages.getAll", queryKey(), params.key?.()],
		queryFn: () =>
			request<ResponseBody<LanguageResponse[]>>({
				url: "/api/v1/languages",
				config: {
					method: "GET",
				},
			}),
		get enabled() {
			return params.enabled ? params.enabled() : true;
		},
	}));

	// Effects
	createEffect(() => {
		if (query.isSuccess) {
			contentLanguageStore.get.syncContentLanguage(query.data?.data);
			contentLanguageStore.set("languages", query.data?.data || []);
		}
	});

	return query;
};

export default useGetAll;
