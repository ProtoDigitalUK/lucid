import type { FastifyInstance } from "fastify";
// API
import mediaRoutes from "./media.routes.js";

const routes = async (fastify: FastifyInstance) => {
	fastify.register(mediaRoutes, {
		prefix: "/media",
	});
};

export default routes;
