import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import updateMe from "@controllers/account/update-me.js";

const accountRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "patch",
    url: "/",
    middleware: {
      authenticate: true,
      authoriseCSRF: true,
    },
    schema: updateMe.schema,
    controller: updateMe.controller,
  });
};

export default accountRoutes;
