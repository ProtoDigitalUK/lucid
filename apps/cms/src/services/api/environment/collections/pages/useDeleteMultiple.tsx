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
	headers: {
		"headless-environment": string;
	};
}

export const deleteMultipleReq = (params: Params) => {
	return request<APIResponse<null>>({
		url: `/api/v1/pages`,
		csrf: true,
		config: {
			method: "DELETE",
			body: params.body,
			headers: {
				"headless-environment": params.headers["headless-environment"],
			},
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
		invalidates: ["environment.collections.pages.getMultiple"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteMultiple;
