import { createEffect, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Store
import userStore from "@/store/userStore";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Services
import api from "@/services/api";
// Types
import type { UserResT } from "@headless/types/src/users";
import type { APIResponse } from "@/types/api";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface QueryParams {}

const useGetAuthenticatedUser = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	const logout = api.auth.useLogout();

	const query = createQuery(() => ({
		queryKey: ["users.getSingle", queryKey(), params.key?.()],
		queryFn: () =>
			request<APIResponse<UserResT>>({
				url: "/api/v1/account",
				config: {
					method: "GET",
				},
			}),
		get enabled() {
			return params.enabled ? params.enabled() : true;
		},
	}));

	createEffect(() => {
		if (query.isSuccess) {
			userStore.set("user", query.data.data);
		}
		if (query.isError) {
			logout.action.mutate({});
		}
	});

	return query;
};

export default useGetAuthenticatedUser;
