import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getHealth from "@controllers/health/get-health.js";

const healthRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    schema: getHealth.schema,
    controller: getHealth.controller,
  });
};

export default healthRoutes;
