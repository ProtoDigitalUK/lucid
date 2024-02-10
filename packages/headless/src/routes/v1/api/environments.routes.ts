import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import environments from "../../../controllers/environments/index.js";

const environmentRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: {
			global: ["create_environment"],
		},
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: environments.createSingle.swaggerSchema,
		zodSchema: environments.createSingle.zodSchema,
		controller: environments.createSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:key",
		permissions: {
			global: ["update_environment"],
		},
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: environments.updateSingle.swaggerSchema,
		zodSchema: environments.updateSingle.zodSchema,
		controller: environments.updateSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: environments.getAll.swaggerSchema,
		zodSchema: environments.getAll.zodSchema,
		controller: environments.getAll.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:key",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: environments.getSingle.swaggerSchema,
		zodSchema: environments.getSingle.zodSchema,
		controller: environments.getSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:key",
		permissions: {
			global: ["delete_environment"],
		},
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: environments.deleteSingle.swaggerSchema,
		zodSchema: environments.deleteSingle.zodSchema,
		controller: environments.deleteSingle.controller,
	});
};

export default environmentRoutes;
