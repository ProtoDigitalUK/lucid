import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
	id: number;
}

export const deleteSingleReq = (params: Params) => {
	return request<APIResponse<null>>({
		url: `/api/v1/collections/multiple-page/${params.id}`,
		csrf: true,
		config: {
			method: "DELETE",
		},
	});
};

interface UseDeleteProps {
	onSuccess?: () => void;
	onError?: () => void;
	collectionName: string;
}

const useDeleteSingle = (props: UseDeleteProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
		mutationFn: deleteSingleReq,
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

export default useDeleteSingle;
