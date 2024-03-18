import { createEffect, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Store
import { syncEnvironment } from "@/store/environmentStore";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@headless/types/src/environments";

interface QueryParams {}

const useGetAll = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	const query = createQuery(() => ({
		queryKey: ["environment.getAll", queryKey(), params.key?.()],
		queryFn: () =>
			request<APIResponse<EnvironmentResT[]>>({
				url: `/api/v1/environments`,
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
			syncEnvironment(query.data?.data);
		}
	});

	return query;
};

export default useGetAll;
