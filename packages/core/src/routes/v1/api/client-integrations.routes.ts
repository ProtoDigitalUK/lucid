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

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: clientIntegration.getAll.swaggerSchema,
		zodSchema: clientIntegration.getAll.zodSchema,
		controller: clientIntegration.getAll.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		permissions: ["delete_client_integration"],
		swaggerSchema: clientIntegration.deleteSingle.swaggerSchema,
		zodSchema: clientIntegration.deleteSingle.zodSchema,
		controller: clientIntegration.deleteSingle.controller,
	});
};

export default clientIntegrationRoutes;
