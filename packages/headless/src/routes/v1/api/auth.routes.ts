import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
// Controllers
import auth from "../../../controllers/auth/index.js";

const authRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/csrf",
		zodSchema: auth.getCSRF.zodSchema,
		swaggerSchema: auth.getCSRF.swaggerSchema,
		controller: auth.getCSRF.controller,
	});

	r(fastify, {
		method: "get",
		url: "/me",
		middleware: {
			authenticate: true,
		},
		zodSchema: auth.getAuthenticatedUser.zodSchema,
		swaggerSchema: auth.getAuthenticatedUser.swaggerSchema,
		controller: auth.getAuthenticatedUser.controller,
	});

	r(fastify, {
		method: "post",
		url: "/login",
		middleware: {
			authoriseCSRF: true,
		},
		zodSchema: auth.login.zodSchema,
		swaggerSchema: auth.login.swaggerSchema,
		controller: auth.login.controller,
	});
};

export default authRoutes;
