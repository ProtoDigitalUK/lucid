import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import login from "@controllers/auth/login.js";
import logout from "@controllers/auth/logout.js";
import getAuthenticatedUser from "@controllers/auth/get-authenticated-user.js";
import getCSRF from "@controllers/auth/get-csrf.js";

import sendResetPassword from "@controllers/auth/send-reset-password.js";
import verifyResetPassword from "@controllers/auth/verify-reset-password.js";
import resetPassword from "@controllers/auth/reset-password.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "post",
  path: "/login",
  middleware: {
    authoriseCSRF: true,
  },
  schema: login.schema,
  controller: login.controller,
});

r(router, {
  method: "post",
  path: "/logout",
  schema: logout.schema,
  controller: logout.controller,
});

r(router, {
  method: "get",
  path: "/me",
  middleware: {
    authenticate: true,
  },
  schema: getAuthenticatedUser.schema,
  controller: getAuthenticatedUser.controller,
});

r(router, {
  method: "get",
  path: "/csrf",
  schema: getCSRF.schema,
  controller: getCSRF.controller,
});

r(router, {
  method: "post",
  path: "/reset-password",
  middleware: {
    authoriseCSRF: true,
  },
  schema: sendResetPassword.schema,
  controller: sendResetPassword.controller,
});

r(router, {
  method: "get",
  path: "/reset-password/:token",
  schema: verifyResetPassword.schema,
  controller: verifyResetPassword.controller,
});

r(router, {
  method: "patch",
  path: "/reset-password/:token",
  middleware: {
    authoriseCSRF: true,
  },
  schema: resetPassword.schema,
  controller: resetPassword.controller,
});

export default router;
