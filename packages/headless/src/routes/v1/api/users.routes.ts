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

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		zodSchema: users.getMultiple.zodSchema,
		swaggerSchema: users.getMultiple.swaggerSchema,
		controller: users.getMultiple.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_user"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: users.deleteSingle.zodSchema,
		swaggerSchema: users.deleteSingle.swaggerSchema,
		controller: users.deleteSingle.controller,
	});
};

export default usersRoutes;
