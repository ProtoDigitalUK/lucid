import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import singleBuilder from "../../../controllers/single-builder/index.js";

const singleBuilderRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "patch",
		url: "/:collection_key",
		permissions: ["update_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
			contentLanguage: true,
		},
		swaggerSchema: singleBuilder.updateSingle.swaggerSchema,
		zodSchema: singleBuilder.updateSingle.zodSchema,
		controller: singleBuilder.updateSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:collection_key",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: singleBuilder.getSingle.swaggerSchema,
		zodSchema: singleBuilder.getSingle.zodSchema,
		controller: singleBuilder.getSingle.controller,
	});
};

export default singleBuilderRoutes;
