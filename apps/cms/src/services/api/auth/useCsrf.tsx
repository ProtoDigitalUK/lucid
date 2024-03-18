// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

export const csrfReq = async () => {
	const csrfToken = sessionStorage.getItem("_csrf");
	if (csrfToken) {
		return csrfToken;
	}

	const res = await request<
		APIResponse<{
			_csrf: string;
		}>
	>({
		url: `/api/v1/auth/csrf`,
		config: {
			method: "GET",
		},
	});

	if (res.data) {
		sessionStorage.setItem("_csrf", res.data._csrf);
		return res.data._csrf;
	}

	return null;
};

interface UseCSRFProps {
	onSuccess?: () => void;
	onError?: () => void;
}

const useCsrf = (props: UseCSRFProps) => {
	// -----------------------------
	// Mutation
	return serviceHelpers.useMutationWrapper<unknown, string | null>({
		mutationFn: csrfReq,
		onSuccess: props.onSuccess,
		onError: props.onError,
	});
};

export default useCsrf;
