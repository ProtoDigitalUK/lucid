import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import multipleBuilder from "../../../controllers/multiple-builder/index.js";

const multipleBuilderRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/:id/valid-parents",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: multipleBuilder.getMultipleValidParents.swaggerSchema,
		zodSchema: multipleBuilder.getMultipleValidParents.zodSchema,
		controller: multipleBuilder.getMultipleValidParents.controller,
	});

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

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: multipleBuilder.getSingle.swaggerSchema,
		zodSchema: multipleBuilder.getSingle.zodSchema,
		controller: multipleBuilder.getSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:id",
		permissions: ["update_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: multipleBuilder.updateSingle.swaggerSchema,
		zodSchema: multipleBuilder.updateSingle.zodSchema,
		controller: multipleBuilder.updateSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: multipleBuilder.deleteSingle.swaggerSchema,
		zodSchema: multipleBuilder.deleteSingle.zodSchema,
		controller: multipleBuilder.deleteSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "",
		permissions: ["delete_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: multipleBuilder.deleteMultiple.swaggerSchema,
		zodSchema: multipleBuilder.deleteMultiple.zodSchema,
		controller: multipleBuilder.deleteMultiple.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: multipleBuilder.getMultiple.swaggerSchema,
		zodSchema: multipleBuilder.getMultiple.zodSchema,
		controller: multipleBuilder.getMultiple.controller,
	});
};

export default multipleBuilderRoutes;
