import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
	email: string;
}

export const sendPasswordResetReq = (params: Params) => {
	return request<
		APIResponse<{
			message: string;
		}>,
		Params
	>({
		url: `/api/v1/auth/reset-password`,
		csrf: true,
		config: {
			method: "POST",
			body: params,
		},
	});
};

interface UseForgotPasswordProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useForgotPassword = (props: UseForgotPasswordProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<
		Params,
		APIResponse<{
			message: string;
		}>
	>({
		mutationFn: sendPasswordResetReq,
		successToast: {
			title: T("password_reset_toast_title"),
			message: T("password_reset_toast_message"),
		},
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useForgotPassword;
