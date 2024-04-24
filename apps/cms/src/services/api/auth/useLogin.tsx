import T from "@/translations";
import { useNavigate } from "@solidjs/router";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { ResponseBody, UserResponse } from "@protoheadless/core/types";

interface Params {
	username_or_email: string;
	password: string;
}

export const loginReq = (params: Params) => {
	return request<ResponseBody<UserResponse>>({
		url: "/api/v1/auth/login",
		csrf: true,
		config: {
			method: "POST",
			body: params,
		},
	});
};

interface UseLoginProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useLogin = (props?: UseLoginProps) => {
	const navigate = useNavigate();

	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<Params, ResponseBody<UserResT>>({
		mutationFn: loginReq,
		successToast: {
			title: T("login_success_toast_title"),
			message: T("login_success_toast_message"),
		},
		invalidates: ["roles.getMultiple", "roles.getSingle"],
		onSuccess: () => {
			navigate("/");
			props?.onSuccess?.();
		},
		onError: props?.onError,
	});
};

export default useLogin;
