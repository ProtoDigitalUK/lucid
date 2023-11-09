import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getAllConfig from "@controllers/brick-config/get-all.js";
import getSingleConfig from "@controllers/brick-config/get-single.js";

const brickRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/config",
    middleware: {
      authenticate: true,
    },
    schema: getAllConfig.schema,
    controller: getAllConfig.controller,
  });

  r(fastify, {
    method: "get",
    url: "/config/:brick_key",
    middleware: {
      authenticate: true,
    },
    schema: getSingleConfig.schema,
    controller: getSingleConfig.controller,
  });
};

export default brickRoutes;
