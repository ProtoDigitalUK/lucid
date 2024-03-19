// Utils
import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { MediaResT } from "@headless/types/src/media";

interface Params {
	body: {
		file: File;
		title_translations: Array<{
			language_id: number | null;
			value: string | null;
		}>;
		alt_translations: Array<{
			language_id: number | null;
			value: string | null;
		}>;
	};
}
interface Response {
	id: MediaResT["id"];
}

export const createSingleReq = (params: Params) => {
	const bodyQueryParam = JSON.stringify({
		title_translations: params.body.title_translations,
		alt_translations: params.body.alt_translations,
	});

	return request<APIResponse<Response>>({
		url: `/api/v1/media/file?body=${bodyQueryParam}`,
		csrf: true,
		config: {
			method: "POST",
			body: objectToFormData({
				file: params.body.file,
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
