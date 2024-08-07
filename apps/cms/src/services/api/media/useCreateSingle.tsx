import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
import serviceHelpers from "@/utils/service-helpers";
import type { ResponseBody, MediaResponse } from "@lucidcms/core/types";

interface Params {
	file: File;
	title: Array<{
		localeCode: string | null;
		value: string | null;
	}>;
	alt: Array<{
		localeCode: string | null;
		value: string | null;
	}>;
}
interface Response {
	id: MediaResponse["id"];
}

export const createSingleReq = (params: Params) => {
	const bodyQueryParam = JSON.stringify({
		title: params.title,
		alt: params.alt,
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
