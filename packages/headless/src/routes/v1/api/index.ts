import { FastifyInstance } from "fastify";
// API
import authRoutes from "./auth.routes.js";
import environmentRoutes from "./environments.routes.js";
import permissionRoutes from "./permissions.routes.js";
import roleRoutes from "./roles.routes.js";
import accountRoutes from "./account.routes.js";
import langaugeRoutes from "./languages.routes.js";
import emailRoutes from "./emails.routes.js";
import mediaRoutes from "./media.routes.js";

const routes = async (fastify: FastifyInstance) => {
	fastify.register(authRoutes, {
		prefix: "/auth",
	});
	fastify.register(accountRoutes, {
		prefix: "/account",
	});
	fastify.register(permissionRoutes, {
		prefix: "/permissions",
	});
	fastify.register(langaugeRoutes, {
		prefix: "/languages",
	});
	fastify.register(environmentRoutes, {
		prefix: "/environments",
	});
	fastify.register(roleRoutes, {
		prefix: "/roles",
	});
	fastify.register(emailRoutes, {
		prefix: "/emails",
	});
	fastify.register(mediaRoutes, {
		prefix: "/media",
	});
};

export default routes;
