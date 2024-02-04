import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import environments from "../../../controllers/environments/index.js";

const environmentRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		// permissions: {
		//   global: ["create_environment"],
		// },
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
		// permissions: {
		// global: ["update_environment"],
		//   },
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
};

export default environmentRoutes;
