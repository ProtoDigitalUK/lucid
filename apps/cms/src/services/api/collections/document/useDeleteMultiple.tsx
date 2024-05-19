import T from "@/translations";
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
import type { ResponseBody } from "@lucidcms/core/types";

interface Params {
	collectionKey: string;
	body: {
		ids: number[];
	};
}

export const deleteMultipleReq = (params: Params) => {
	return request<ResponseBody<null>>({
		url: `/api/v1/collections/documents/${params.collectionKey}`,
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
			title: T()("deleted_toast_title", {
				name: props.collectionName,
			}),
			message: T()("deleted_toast_message", {
				name: {
					value: props.collectionName,
					toLowerCase: true,
				},
			}),
		},
		invalidates: ["collections.document.getMultiple"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteMultiple;
