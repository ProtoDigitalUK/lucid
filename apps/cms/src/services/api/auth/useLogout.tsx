import T from "@/translations";
import { useNavigate } from "@solidjs/router";
// Store
import userStore from "@/store/userStore";
// Utils
import { clearCookie } from "@/utils/cookie";
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

export const logoutReq = () => {
	return request<
		APIResponse<{
			message: string;
		}>
	>({
		url: `/api/v1/auth/logout`,
		config: {
			method: "POST",
		},
	});
};

interface UseLogoutProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useLogout = (props?: UseLogoutProps) => {
	const navigate = useNavigate();

	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<
		unknown,
		APIResponse<{
			message: string;
		}>
	>({
		mutationFn: logoutReq,
		successToast: {
			title: T("logout_success_toast_title"),
			message: T("logout_success_toast_message"),
		},
		invalidates: ["roles.getMultiple", "roles.getSingle"],
		onSuccess: () => {
			userStore.get.reset();
			navigate("/login");
			sessionStorage.removeItem("_csrf");
			props?.onSuccess?.();
		},
		onError: () => {
			clearCookie("auth");
			navigate("/login");
			props?.onError?.();
		},
	});
};

export default useLogout;
