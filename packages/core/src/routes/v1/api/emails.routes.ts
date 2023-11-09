import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getMultiple from "@controllers/email/get-multiple.js";
import getSingle from "@controllers/email/get-single.js";
import deleteSingle from "@controllers/email/delete-single.js";
import resendSingle from "@controllers/email/resend-single.js";

const emailRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    permissions: {
      global: ["read_email"],
    },
    middleware: {
      authenticate: true,
      paginated: true,
    },
    schema: getMultiple.schema,
    controller: getMultiple.controller,
  });

  r(fastify, {
    method: "get",
    url: "/:id",
    permissions: {
      global: ["read_email"],
    },
    middleware: {
      authenticate: true,
    },
    schema: getSingle.schema,
    controller: getSingle.controller,
  });

  r(fastify, {
    method: "delete",
    url: "/:id",
    permissions: {
      global: ["delete_email"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: deleteSingle.schema,
    controller: deleteSingle.controller,
  });

  r(fastify, {
    method: "post",
    url: "/:id/resend",
    permissions: {
      global: ["send_email"],
    },
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: resendSingle.schema,
    controller: resendSingle.controller,
  });
};

export default emailRoutes;
