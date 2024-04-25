import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@protoheadless/core/types";

interface Params {
	body: {
		title_translations: {
			value: string | null;
			language_id: number | null;
		}[];
		excerpt_translations: {
			value: string | null;
			language_id: number | null;
		}[];
		slug: string | null;
		collection_key: string;
		homepage?: boolean;
		published?: boolean;
		parent_id?: number;
		category_ids?: number[];
	};
}

export const createSingleReq = (params: Params) => {
	return request<ResponseBody<null>>({
		url: "/api/v1/collections/multiple-builder",
		csrf: true,
		config: {
			method: "POST",
			body: params.body,
		},
	});
};

interface UseCreateSingleProps {
	onSuccess?: () => void;
	onError?: () => void;
	collectionName: string;
}

const useCreateSingle = (props: UseCreateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, ResponseBody<null>>({
		mutationFn: createSingleReq,
		successToast: {
			title: T("create_toast_title", {
				name: props.collectionName,
			}),
			message: T("create_toast_message", {
				name: {
					value: props.collectionName,
					toLowerCase: true,
				},
			}),
		},
		invalidates: ["collections.multipleBuilder.getMultiple"],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useCreateSingle;
