import { createEffect, createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import { APIResponse } from "@/types/api";
import { LanguageResT } from "@headless/types/src/language";

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
			request<APIResponse<LanguageResT[]>>({
				url: `/api/v1/languages`,
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
