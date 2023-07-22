import login from "./login";
import csrf from "./csrf";
import logout from "./logout";
import registerSuperAdmin from "./register-superadmin";
import sendPasswordReset from "./send-password-reset";
import resetPassword from "./reset-password";
import verifyResetToken from "./verify-reset-token";

const exportObject = {
  login,
  csrf,
  logout,
  registerSuperAdmin,
  sendPasswordReset,
  resetPassword,
  verifyResetToken,
};

export default exportObject;
