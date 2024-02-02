import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
// Controllers
import auth from "../../../controllers/auth/index.js";

const authRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/me",
		// zodSchema: getAuthenticatedUser.zodSchema,
		swaggerSchema: auth.getAuthenticatedUser.swaggerSchema,
		controller: auth.getAuthenticatedUser.controller,
	});
	r(fastify, {
		method: "get",
		url: "/csrf",
		// zodSchema: getCSRF.zodSchema,
		swaggerSchema: auth.getCSRF.swaggerSchema,
		controller: auth.getCSRF.controller,
	});
};

export default authRoutes;
