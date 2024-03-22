import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import categories from "../../../controllers/categories/index.js";

const categoriesRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_category"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: categories.createSingle.swaggerSchema,
		zodSchema: categories.createSingle.zodSchema,
		controller: categories.createSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: categories.getSingle.swaggerSchema,
		zodSchema: categories.getSingle.zodSchema,
		controller: categories.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: categories.getMultiple.swaggerSchema,
		zodSchema: categories.getMultiple.zodSchema,
		controller: categories.getMultiple.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_category"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: categories.deleteSingle.swaggerSchema,
		zodSchema: categories.deleteSingle.zodSchema,
		controller: categories.deleteSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:id",
		permissions: ["update_category"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: categories.updateSingle.swaggerSchema,
		zodSchema: categories.updateSingle.zodSchema,
		controller: categories.updateSingle.controller,
	});
};

export default categoriesRoutes;
