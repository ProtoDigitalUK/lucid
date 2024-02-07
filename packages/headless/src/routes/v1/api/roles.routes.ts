import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import roles from "../../../controllers/roles/index.js";

const roleRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: roles.createSingle.swaggerSchema,
		zodSchema: roles.createSingle.zodSchema,
		controller: roles.createSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: roles.getSingle.swaggerSchema,
		zodSchema: roles.getSingle.zodSchema,
		controller: roles.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			paginated: true,
		},
		swaggerSchema: roles.getMultiple.swaggerSchema,
		zodSchema: roles.getMultiple.zodSchema,
		controller: roles.getMultiple.controller,
	});
};

export default roleRoutes;
