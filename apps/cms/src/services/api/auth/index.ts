import useLogin from "./useLogin";
import useCsrf from "./useCsrf";
import useLogout from "./useLogout";
import useForgotPassword from "./useForgotPassword";
import useResetPassword from "./useResetPassword";
import useVerifyResetToken from "./useVerifyResetToken";

const exportObject = {
  useLogin,
  useCsrf,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useVerifyResetToken,
};

export default exportObject;
