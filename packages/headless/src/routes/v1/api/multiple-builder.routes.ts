import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import multipleBuilder from "../../../controllers/multiple-builder/index.js";

const multipleBuilderRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: multipleBuilder.createSingle.swaggerSchema,
		zodSchema: multipleBuilder.createSingle.zodSchema,
		controller: multipleBuilder.createSingle.controller,
	});
};

export default multipleBuilderRoutes;
