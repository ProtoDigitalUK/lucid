import { FastifyInstance } from "fastify";
// API
import authRoutes from "./auth.routes.js";
import environmentRoutes from "./environments.routes.js";
import permissionRoutes from "./permissions.routes.js";

const routes = async (fastify: FastifyInstance) => {
	fastify.register(authRoutes, {
		prefix: "/auth",
	});
	fastify.register(environmentRoutes, {
		prefix: "/environments",
	});
	fastify.register(permissionRoutes, {
		prefix: "/permissions",
	});
};

export default routes;
