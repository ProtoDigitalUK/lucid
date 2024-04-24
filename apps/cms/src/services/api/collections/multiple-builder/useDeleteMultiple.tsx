import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@protoheadless/core/types";

interface Params {
	body: {
		ids: number[];
	};
}

export const deleteMultipleReq = (params: Params) => {
	return request<ResponseBody<null>>({
		url: "/api/v1/collections/multiple-builder",
		csrf: true,
		config: {
			method: "DELETE",
			body: params.body,
		},
	});
};

interface UseDeleteMultipleProps {
	onSuccess?: () => void;
	onError?: () => void;
	collectionName: string;
}

const useDeleteMultiple = (props: UseDeleteMultipleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, ResponseBody<null>>({
		mutationFn: deleteMultipleReq,
		successToast: {
			title: T("deleted_toast_title", {
				name: props.collectionName,
			}),
			message: T("deleted_toast_message", {
				name: {
					value: props.collectionName,
					toLowerCase: true,
				},
			}),
		},
		invalidates: ["collections.multipleBuilder.getMultiple"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteMultiple;
