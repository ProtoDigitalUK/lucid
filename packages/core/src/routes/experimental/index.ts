import type { FastifyInstance } from "fastify";
import apiV1 from "./api/index.js";

const routes = async (fastify: FastifyInstance) => {
	fastify.register(apiV1, {
		prefix: "/api/EXPERIMENTAL",
	});
};

export default routes;
