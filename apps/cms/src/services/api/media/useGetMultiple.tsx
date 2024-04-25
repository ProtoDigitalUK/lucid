import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody, MediaResponse } from "@protoheadless/core/types";

interface QueryParams {
	queryString?: Accessor<string>;
	filters?: {
		name?: Accessor<string>;
		key?: Accessor<string>;
		mimeType?: Accessor<string>;
		fileExtension?: Accessor<string>;
		type?: Accessor<string | string[]>;
	};
	perPage?: number;
	headers: {
		"headless-content-lang": Accessor<number | undefined> | number;
	};
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
		queryKey: ["media.getMultiple", queryKey(), params.key?.()],
		queryFn: () =>
			request<ResponseBody<MediaResponse[]>>({
				url: "/api/v1/media",
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
