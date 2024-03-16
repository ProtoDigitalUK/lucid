import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import users from "../../../controllers/users/index.js";

const usersRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_user"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: users.createSingle.zodSchema,
		swaggerSchema: users.createSingle.swaggerSchema,
		controller: users.createSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		zodSchema: users.getSingle.zodSchema,
		swaggerSchema: users.getSingle.swaggerSchema,
		controller: users.getSingle.controller,
	});
};

export default usersRoutes;
