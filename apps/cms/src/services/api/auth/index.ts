import useLogin from "./useLogin";
import useCsrf from "./useCsrf";
import useLogout from "./useLogout";
import useForgotPassword from "./useForgotPassword";
import useResetPassword from "./useResetPassword";
import useVerifyResetToken from "./useVerifyResetToken";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";

const exportObject = {
	useLogin,
	useCsrf,
	useLogout,
	useForgotPassword,
	useResetPassword,
	useVerifyResetToken,
	useGetAuthenticatedUser,
};

export default exportObject;
