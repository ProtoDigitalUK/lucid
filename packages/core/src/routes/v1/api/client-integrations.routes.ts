import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import clientIntegration from "../../../controllers/client-integrations/index.js";

const clientIntegrationRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		permissions: ["create_client_integration"],
		swaggerSchema: clientIntegration.createSingle.swaggerSchema,
		zodSchema: clientIntegration.createSingle.zodSchema,
		controller: clientIntegration.createSingle.controller,
	});
};

export default clientIntegrationRoutes;
