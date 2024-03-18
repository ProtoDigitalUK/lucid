import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
	id: number;
}

export const deleteProcessedImagesReq = (params: Params) => {
	return request<APIResponse<null>>({
		url: `/api/v1/media/${params.id}/processed`,
		csrf: true,
		config: {
			method: "DELETE",
		},
	});
};

interface UseDeleteProcessedImagesProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useDeleteProcessedImages = (props: UseDeleteProcessedImagesProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
		mutationFn: deleteProcessedImagesReq,
		successToast: {
			title: T("delete_processed_images_toast_title"),
			message: T("delete_processed_images_toast_message"),
		},
		invalidates: ["settings.getSettings"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteProcessedImages;
