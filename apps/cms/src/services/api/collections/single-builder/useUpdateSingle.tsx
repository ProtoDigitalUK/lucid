import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse, APIErrorResponse } from "@/types/api";
import type { BrickDataT } from "@/store/builderStore";

interface Params {
	collection_key: string;
	body: {
		bricks: Array<BrickDataT>;
	};
}

export const updateSingleReq = (params: Params) => {
	return request<APIResponse<null>>({
		url: `/api/v1/collections/single-builder/${params.collection_key}`,
		csrf: true,
		config: {
			method: "PATCH",
			body: params.body,
		},
	});
};

interface UseUpdateSingleProps {
	onSuccess?: () => void;
	onError?: (_errors: APIErrorResponse | undefined) => void;
	collectionName: string;
}

const useUpdateSingle = (props: UseUpdateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
		mutationFn: updateSingleReq,
		successToast: {
			title: T("update_toast_title", {
				name: props.collectionName || "Content",
			}),
			message: T("update_toast_message", {
				name: {
					value: props.collectionName || "Content",
					toLowerCase: true,
				},
			}),
		},
		invalidates: ["collections.singleBuilder.getSingle"],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useUpdateSingle;
