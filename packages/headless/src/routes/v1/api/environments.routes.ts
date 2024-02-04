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
};

export default environmentRoutes;
