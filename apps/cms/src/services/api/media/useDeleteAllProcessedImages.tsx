import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

export const deleteAllProcessedImagesReq = () => {
	return request<APIResponse<null>>({
		url: "/api/v1/media/processed",
		csrf: true,
		config: {
			method: "DELETE",
		},
	});
};

interface UseDeleteAllProcessedImagesProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useDeleteAllProcessedImages = (
	props: UseDeleteAllProcessedImagesProps,
) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<unknown, APIResponse<null>>({
		mutationFn: deleteAllProcessedImagesReq,
		successToast: {
			title: T("delete_processed_images_toast_title"),
			message: T("delete_processed_images_toast_message"),
		},
		invalidates: ["settings.getSettings"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteAllProcessedImages;
