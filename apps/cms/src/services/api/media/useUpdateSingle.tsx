import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
import objectToFormData from "@/utils/object-to-formdata";
// Types
import type { ResponseBody } from "@protoheadless/core/types";

interface Params {
	id: number;
	body: {
		file: File;
		titleTranslations: Array<{
			languageId: number | null;
			value: string | null;
		}>;
		altTranslations: Array<{
			languageId: number | null;
			value: string | null;
		}>;
	};
}

export const updateSingleReq = (params: Params) => {
	const bodyQueryParam = JSON.stringify({
		titleTranslations: params.body.titleTranslations,
		altTranslations: params.body.altTranslations,
	});

	return request<ResponseBody<null>>({
		url: `/api/v1/media/${params.id}?body=${bodyQueryParam}`,
		csrf: true,
		config: {
			method: "PATCH",
			body: objectToFormData(params.body),
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
	return serviceHelpers.useMutationWrapper<Params, ResponseBody<null>>({
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
