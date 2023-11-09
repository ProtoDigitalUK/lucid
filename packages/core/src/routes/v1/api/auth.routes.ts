import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import login from "@controllers/auth/login.js";
import logout from "@controllers/auth/logout.js";
import getAuthenticatedUser from "@controllers/auth/get-authenticated-user.js";
import getCSRF from "@controllers/auth/get-csrf.js";

import sendResetPassword from "@controllers/auth/send-reset-password.js";
import verifyResetPassword from "@controllers/auth/verify-reset-password.js";
import resetPassword from "@controllers/auth/reset-password.js";

const authRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "post",
    url: "/login",
    middleware: {
      authoriseCSRF: true,
    },
    schema: login.schema,
    controller: login.controller,
  });

  r(fastify, {
    method: "post",
    url: "/logout",
    schema: logout.schema,
    controller: logout.controller,
  });

  r(fastify, {
    method: "get",
    url: "/me",
    middleware: {
      authenticate: true,
    },
    schema: getAuthenticatedUser.schema,
    controller: getAuthenticatedUser.controller,
  });

  r(fastify, {
    method: "get",
    url: "/csrf",
    schema: getCSRF.schema,
    controller: getCSRF.controller,
  });

  r(fastify, {
    method: "post",
    url: "/reset-password",
    middleware: {
      authoriseCSRF: true,
    },
    schema: sendResetPassword.schema,
    controller: sendResetPassword.controller,
  });

  r(fastify, {
    method: "get",
    url: "/reset-password/:token",
    schema: verifyResetPassword.schema,
    controller: verifyResetPassword.controller,
  });

  r(fastify, {
    method: "patch",
    url: "/reset-password/:token",
    middleware: {
      authoriseCSRF: true,
    },
    schema: resetPassword.schema,
    controller: resetPassword.controller,
  });
};

export default authRoutes;
