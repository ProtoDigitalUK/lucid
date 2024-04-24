import T from "@/translations";
import { useNavigate } from "@solidjs/router";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody } from "@protoheadless/core/types";

interface Params {
	token: string;
	password: string;
	password_confirmation: string;
}

export const resetPasswordReq = async (params: Params) => {
	return request<
		ResponseBody<{
			message: string;
		}>
	>({
		url: `/api/v1/account/reset-password/${params.token}`,
		csrf: true,
		config: {
			method: "PATCH",
			body: {
				password: params.password,
				password_confirmation: params.password_confirmation,
			},
		},
	});
};

interface UseResetPasswordProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useResetPassword = (props?: UseResetPasswordProps) => {
	const navigate = useNavigate();

	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<
		Params,
		ResponseBody<{
			message: string;
		}>
	>({
		mutationFn: resetPasswordReq,
		successToast: {
			title: T("password_reset_success_toast_title"),
			message: T("password_reset_success_toast_message"),
		},
		invalidates: ["roles.getMultiple", "roles.getSingle"],
		onSuccess: () => {
			navigate("/login");
			props?.onSuccess?.();
		},
		onError: () => {
			props?.onError?.();
		},
	});
};

export default useResetPassword;
