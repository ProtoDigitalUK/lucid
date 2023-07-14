import { Router } from "express";
import r from "@utils/app/route";
// Controller
import login from "@controllers/auth/login";
import logout from "@controllers/auth/logout";
import getAuthenticatedUser from "@controllers/auth/get-authenticated-user";
import getCSRF from "@controllers/auth/get-csrf";
import registerSuperadmin from "@controllers/auth/register-superadmin";
import forgotPassword from "@controllers/auth/forgot-password";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/login",
  middleware: {
    authoriseCSRF: true,
  },
  schema: login.schema,
  controller: login.controller,
});

r(router, {
  method: "get",
  path: "/logout",
  schema: logout.schema,
  controller: logout.controller,
});

r(router, {
  method: "get",
  path: "/me",
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
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

// only used to register the first superadmin (the inital account)
r(router, {
  method: "post",
  path: "/register-superadmin",
  middleware: {
    authoriseCSRF: true,
  },
  schema: registerSuperadmin.schema,
  controller: registerSuperadmin.controller,
});

r(router, {
  method: "post",
  path: "/forgot-password",
  middleware: {
    authoriseCSRF: true,
  },
  schema: forgotPassword.schema,
  controller: forgotPassword.controller,
});

export default router;
