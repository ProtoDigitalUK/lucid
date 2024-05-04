import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@lucidcms/core/types";

interface Params {
	email: string;
}

export const sendPasswordResetReq = (params: Params) => {
	return request<
		ResponseBody<{
			message: string;
		}>,
		Params
	>({
		url: "/api/v1/account/reset-password",
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
		ResponseBody<{
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
