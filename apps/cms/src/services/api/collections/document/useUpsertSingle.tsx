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
	body: {
		documentId?: number;
		bricks?: Array<BrickData>;
		fields?: Array<FieldResponse>;
	};
}

export const upsertSingleReq = (params: Params) => {
	return request<
		ResponseBody<{
			id: number;
		}>
	>({
		url: `/api/v1/collections/documents/${params.collectionKey}`,
		csrf: true,
		config: {
			method: "POST",
			body: params.body,
		},
	});
};

interface UseUpdateSingleProps {
	onSuccess?: (
		_data: ResponseBody<{
			id: number;
		}>,
	) => void;
	onError?: (_errors: ErrorResponse | undefined) => void;
	collectionName: string;
}

const useUpsertSingle = (props: UseUpdateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<
		Params,
		ResponseBody<{
			id: number;
		}>
	>({
		mutationFn: upsertSingleReq,
		successToast: {
			title: T()("update_toast_title", {
				name: props.collectionName || "Content",
			}),
			message: T()("update_toast_message", {
				name: {
					value: props.collectionName || "Content",
					toLowerCase: true,
				},
			}),
		},
		invalidates: [
			"collections.document.getMultiple",
			"collections.document.getSingle",
		],
		onSuccess: props?.onSuccess,
		onError: props?.onError,
	});
};

export default useUpsertSingle;
