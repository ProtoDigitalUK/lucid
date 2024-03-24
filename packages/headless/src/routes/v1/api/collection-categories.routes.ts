import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import collectionCategories from "../../../controllers/collection-categories/index.js";

const collectionCategoriesRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_category"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionCategories.createSingle.swaggerSchema,
		zodSchema: collectionCategories.createSingle.zodSchema,
		controller: collectionCategories.createSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: collectionCategories.getSingle.swaggerSchema,
		zodSchema: collectionCategories.getSingle.zodSchema,
		controller: collectionCategories.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: collectionCategories.getMultiple.swaggerSchema,
		zodSchema: collectionCategories.getMultiple.zodSchema,
		controller: collectionCategories.getMultiple.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_category"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionCategories.deleteSingle.swaggerSchema,
		zodSchema: collectionCategories.deleteSingle.zodSchema,
		controller: collectionCategories.deleteSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:id",
		permissions: ["update_category"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionCategories.updateSingle.swaggerSchema,
		zodSchema: collectionCategories.updateSingle.zodSchema,
		controller: collectionCategories.updateSingle.controller,
	});
};

export default collectionCategoriesRoutes;
