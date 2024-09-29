import { createMemo, type Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
import type {
	ResponseBody,
	CollectionDocumentResponse,
} from "@lucidcms/core/types";

interface QueryParams {
	queryString?: Accessor<string>;
	filters?: Record<
		string,
		Accessor<string | string[] | undefined> | string | string[]
	>;
	location: {
		collectionKey: Accessor<string | undefined> | string;
	};
	perPage?: Accessor<number> | number;
}

const useGetMultiple = (params: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params.queryParams),
	);
	const queryKey = createMemo(() => serviceHelpers.getQueryKey(queryParams()));

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: ["collections.document.getMultiple", queryKey(), params.key?.()],
		queryFn: () =>
			request<ResponseBody<CollectionDocumentResponse[]>>({
				url: `/api/v1/collections/documents/${
					queryParams().location?.collectionKey
				}`,
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
