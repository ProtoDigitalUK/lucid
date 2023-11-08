import { FastifyInstance } from "fastify";
// CDN
import cdn from "@routes/v1/cdn/cdn.routes.js";

const routes = async (fastify: FastifyInstance) => {
  fastify.register(cdn);
};

export default routes;
