// Utils
import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody, MediaResponse } from "@lucidcms/core/types";

interface Params {
	file: File;
	titleTranslations: Array<{
		languageId: number | null;
		value: string | null;
	}>;
	altTranslations: Array<{
		languageId: number | null;
		value: string | null;
	}>;
}
interface Response {
	id: MediaResponse["id"];
}

export const createSingleReq = (params: Params) => {
	const bodyQueryParam = JSON.stringify({
		titleTranslations: params.titleTranslations,
		altTranslations: params.altTranslations,
	});

	return request<ResponseBody<Response>>({
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
	onSuccess?: (_data: ResponseBody<Response>) => void;
	onError?: () => void;
}

const useCreateSingle = (props?: UseCreateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, ResponseBody<Response>>({
		mutationFn: createSingleReq,
		invalidates: ["media.getMultiple"],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useCreateSingle;
