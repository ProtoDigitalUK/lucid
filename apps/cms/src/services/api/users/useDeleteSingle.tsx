import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse } from "@/types/api";
import type { UserResT } from "@headless/types/src/users";

interface Params {
	id: number;
}

export const deleteSingleReq = (params: Params) => {
	return request<APIResponse<UserResT>>({
		url: `/api/v1/users/${params.id}`,
		csrf: true,
		config: {
			method: "DELETE",
		},
	});
};

interface UseDeleteProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useDeleteSingle = (props: UseDeleteProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, APIResponse<UserResT>>({
		mutationFn: deleteSingleReq,
		successToast: {
			title: T("user_deleted_toast_title"),
			message: T("user_deleted_toast_message"),
		},
		invalidates: ["users.getMultiple", "users.getSingle"],
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useDeleteSingle;
