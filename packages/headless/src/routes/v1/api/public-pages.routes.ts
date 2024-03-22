import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import publicPages from "../../../controllers/public/pages/index.js";

const publicPagesRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/:slug",
		middleware: {
			// TODO: integration authentication instead of authenticate
			authenticate: true,
		},
		swaggerSchema: publicPages.getSingle.swaggerSchema,
		zodSchema: publicPages.getSingle.zodSchema,
		controller: publicPages.getSingle.controller,
	});
};

export default publicPagesRoutes;
