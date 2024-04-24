import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type {
	ResponseBody,
	CollectionResponse,
} from "@protoheadless/core/types";

interface QueryParams {
	include: Record<"bricks", boolean>;
	filters?: {
		type?: Accessor<string | undefined>;
	};
}

const useGetAll = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: ["collections.getAll", queryKey(), params.key?.()],
		queryFn: () =>
			request<ResponseBody<CollectionResponse[]>>({
				url: "/api/v1/collections",
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

export default useGetAll;
