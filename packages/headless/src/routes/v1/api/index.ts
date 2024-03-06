import { FastifyInstance } from "fastify";
// API
import authRoutes from "./auth.routes.js";
import permissionRoutes from "./permissions.routes.js";
import roleRoutes from "./roles.routes.js";
import accountRoutes from "./account.routes.js";
import langaugeRoutes from "./languages.routes.js";
import emailRoutes from "./emails.routes.js";
import mediaRoutes from "./media.routes.js";
import settingsRoutes from "./settings.routes.js";
import brickRoutes from "./bricks.routes.js";
import publicPagesRoutes from "./public-pages.routes.js";
import collectionRoutes from "./collections.routes.js";
import categoriesRoutes from "./categories.routes.js";

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
	fastify.register(collectionRoutes, {
		prefix: "/collections",
	});
	fastify.register(categoriesRoutes, {
		prefix: "/collections/categories",
	});
	fastify.register(settingsRoutes, {
		prefix: "/settings",
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
	fastify.register(brickRoutes, {
		prefix: "/bricks",
	});
	// Public
	fastify.register(publicPagesRoutes, {
		prefix: "/public/pages",
	});
};

export default routes;
