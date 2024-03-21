import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
	body: {
		ids: number[];
	};
}

export const deleteMultipleReq = (params: Params) => {
	return request<APIResponse<null>>({
		url: "/api/v1/collections/multiple-page",
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
	return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
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
		invalidates: ["collections.multiplePages.getMultiple"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteMultiple;
