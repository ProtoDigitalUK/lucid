import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { MediaResT } from "@headless/types/src/media";

interface Params {
	id: number;
	body: {
		translations: Array<{
			language_id: number;
			alt: string | null;
			name: string | null;
		}>;
	};
}

export const updateSingleReq = (params: Params) => {
	return request<APIResponse<MediaResT>>({
		url: `/api/v1/media/${params.id}`,
		csrf: true,
		config: {
			method: "PATCH",
			body: params.body,
		},
	});
};

interface UseUpdateSingleProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useUpdateSingle = (props?: UseUpdateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, APIResponse<MediaResT>>({
		mutationFn: updateSingleReq,
		successToast: {
			title: T("media_update_toast_title"),
			message: T("media_update_toast_message"),
		},
		invalidates: ["media.getMultiple", "media.getSingle"],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useUpdateSingle;
