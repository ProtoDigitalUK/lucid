import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type {
	ResponseBody,
	ErrorResponse,
	FieldResponseMeta,
	FieldResponseValue,
	FieldTypes,
} from "@lucidcms/core/types";

interface FieldDataT {
	key: string;
	type: FieldTypes;
	languageId: 1;
	value?: FieldResponseValue;
	meta?: FieldResponseMeta;
	groups: Array<Array<FieldDataT>>;
}

interface BrickDataT {
	key: string;
	order: number;
	type: "builder" | "fixed";
	fields?: Array<FieldDataT>;
}

interface Params {
	collectionKey: string;
	body: {
		documentId?: number;
		published?: 1 | 0;
		bricks?: Array<BrickDataT>;
		fields?: Array<FieldDataT>;
	};
}

export const upsertSingleReq = (params: Params) => {
	return request<ResponseBody<null>>({
		url: `/api/v1/collections/documents/${params.collectionKey}`,
		csrf: true,
		config: {
			method: "POST",
			body: params.body,
		},
	});
};

interface UseUpdateSingleProps {
	onSuccess?: () => void;
	onError?: (_errors: ErrorResponse | undefined) => void;
	collectionName: string;
}

const useUpsertSingle = (props: UseUpdateSingleProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, ResponseBody<null>>({
		mutationFn: upsertSingleReq,
		successToast: {
			title: T("update_toast_title", {
				name: props.collectionName || "Content",
			}),
			message: T("update_toast_message", {
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
