import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getAll from "@controllers/permissions/get-all.js";

const permissionRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
    },
    schema: getAll.schema,
    controller: getAll.controller,
  });
};

export default permissionRoutes;
