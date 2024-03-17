import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import singlePage from "../../../controllers/single-page/index.js";

const singlePageRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "patch",
		url: "/:collection_key",
		permissions: ["update_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
			contentLanguage: true,
		},
		swaggerSchema: singlePage.updateSingle.swaggerSchema,
		zodSchema: singlePage.updateSingle.zodSchema,
		controller: singlePage.updateSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:collection_key",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: singlePage.getSingle.swaggerSchema,
		zodSchema: singlePage.getSingle.zodSchema,
		controller: singlePage.getSingle.controller,
	});
};

export default singlePageRoutes;
