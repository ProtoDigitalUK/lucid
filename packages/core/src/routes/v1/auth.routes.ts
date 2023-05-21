import { Router } from "express";
import r from "@utils/route";
// Controller
import login from "@controllers/auth/login";
import logout from "@controllers/auth/logout";
import getAuthenticatedUser from "@controllers/auth/get-authenticated-user";
import getCSRF from "@controllers/auth/get-csrf";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/login",
  authoriseCSRF: true,
  schema: login.schema,
  controller: login.controller,
});

r(router, {
  method: "get",
  path: "/logout",
  authenticate: false,
  authoriseCSRF: false,
  schema: logout.schema,
  controller: logout.controller,
});

r(router, {
  method: "get",
  path: "/me",
  authenticate: true,
  authoriseCSRF: true,
  schema: getAuthenticatedUser.schema,
  controller: getAuthenticatedUser.controller,
});

r(router, {
  method: "get",
  path: "/csrf",
  schema: getCSRF.schema,
  controller: getCSRF.controller,
});

export default router;
