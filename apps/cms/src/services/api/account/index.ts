import useForgotPassword from "./useForgotPassword";
import useResetPassword from "./useResetPassword";
import useVerifyResetToken from "./useVerifyResetToken";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";

const exportObject = {
	useForgotPassword,
	useResetPassword,
	useVerifyResetToken,
	useGetAuthenticatedUser,
};

export default exportObject;
