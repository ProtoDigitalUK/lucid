import login from "./login";
import csrf from "./csrf";
import logout from "./logout";
import registerSuperAdmin from "./register-superadmin";
import sendPasswordReset from "./send-password-reset";

const exportObject = {
  login,
  csrf,
  logout,
  registerSuperAdmin,
  sendPasswordReset,
};

export default exportObject;
