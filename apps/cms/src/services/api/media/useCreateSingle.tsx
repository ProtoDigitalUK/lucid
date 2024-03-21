// Utils
import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse } from "@/types/api";
import type { MediaResT } from "@headless/types/src/media";

interface Params {
	file: File;
	title_translations: Array<{
		language_id: number | null;
		value: string | null;
	}>;
	alt_translations: Array<{
		language_id: number | null;
		value: string | null;
	}>;
}
interface Response {
	id: MediaResT["id"];
}

export const createSingleReq = (params: Params) => {
	const bodyQueryParam = JSON.stringify({
		title_translations: params.title_translations,
		alt_translations: params.alt_translations,
	});

	return request<APIResponse<Response>>({
		url: `/api/v1/media?body=${bodyQueryParam}`,
		csrf: true,
		config: {
			method: "POST",
			body: objectToFormData({
				file: params.file,
			}),
		},
	});
};

interface UseCreateSingleProps {
	onSuccess?: (_data: APIResponse<Response>) => void;
	onError?: () => void;
}

const useCreateSingle = (props?: UseCreateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, APIResponse<Response>>({
		mutationFn: createSingleReq,
		invalidates: ["media.getMultiple"],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useCreateSingle;
