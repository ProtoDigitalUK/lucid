import T from "@/translations";
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
import type { BrickData } from "@/store/brickStore";
import type {
	ResponseBody,
	ErrorResponse,
	FieldResponse,
} from "@lucidcms/core/types";

interface Params {
	collectionKey: string;
	documentId: number;
	body: {
		bricks?: Array<BrickData>;
		fields?: Array<FieldResponse>;
	};
}

export const createDraftReq = (params: Params) => {
	return request<
		ResponseBody<{
			id: number;
		}>
	>({
		url: `/api/v1/collections/documents/${params.collectionKey}/${params.documentId}/draft`,
		csrf: true,
		config: {
			method: "POST",
			body: params.body,
		},
	});
};

interface UseCreateDraftProps {
	onSuccess?: (
		_data: ResponseBody<{
			id: number;
		}>,
	) => void;
	onError?: (_errors: ErrorResponse | undefined) => void;
	getCollectionName: () => string;
}

const useCreateDraft = (props: UseCreateDraftProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<
		Params,
		ResponseBody<{
			id: number;
		}>
	>({
		mutationFn: createDraftReq,
		getSuccessToast: () => {
			return {
				title: T()("update_toast_title", {
					name: props.getCollectionName(),
				}),
				message: T()("update_toast_message", {
					name: props.getCollectionName().toLowerCase(),
				}),
			};
		},
		invalidates: [
			"collections.document.getMultiple",
			"collections.document.getSingle",
		],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useCreateDraft;
