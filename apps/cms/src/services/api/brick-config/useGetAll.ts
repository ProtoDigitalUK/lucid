import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@protoheadless/core/types";
import type { BrickConfigT } from "@headless/types/src/bricks"; // TODO: remvoe

interface QueryParams {
	include: Record<"fields", boolean>;
	filters?: {
		collection_key?: Accessor<string | undefined>;
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
		queryKey: ["brickConfig.getAll", queryKey(), params.key?.()],
		queryFn: () =>
			request<ResponseBody<BrickConfigT[]>>({
				url: "/api/v1/bricks/config",
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
