import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
// Controllers
import getAuthenticatedUser from "../../../controllers/auth/get-authenticated-user.js";

const authRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/me",
		// zodSchema: getAuthenticatedUser.zodSchema,
		swaggerSchema: getAuthenticatedUser.swaggerSchema,
		controller: getAuthenticatedUser.controller,
	});
};

export default authRoutes;
