import T from "@/translations";
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
import objectToFormData from "@/utils/object-to-formdata";
import type { ResponseBody } from "@lucidcms/core/types";

interface Params {
	id: number;
	body: {
		file: File;
		title: Array<{
			localeCode: string | null;
			value: string | null;
		}>;
		alt: Array<{
			localeCode: string | null;
			value: string | null;
		}>;
	};
}

export const updateSingleReq = (params: Params) => {
	const bodyQueryParam = JSON.stringify({
		title: params.body.title,
		alt: params.body.alt,
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
		getSuccessToast: () => ({
			title: T()("media_update_toast_title"),
			message: T()("media_update_toast_message"),
		}),
		invalidates: ["media.getMultiple", "media.getSingle"],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useUpdateSingle;
