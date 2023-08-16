import login from "./login";
import csrf from "./csrf";
import logout from "./logout";
import registerSuperAdmin from "./register-superadmin";
import sendPasswordReset from "./send-password-reset";
import resetPassword from "./reset-password";
import useVerifyResetToken from "./useVerifyResetToken";

const exportObject = {
  login,
  csrf,
  logout,
  registerSuperAdmin,
  sendPasswordReset,
  resetPassword,
  useVerifyResetToken,
};

export default exportObject;
