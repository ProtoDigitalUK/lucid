import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import media from "../../../controllers/media/index.js";

const mediaRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: media.getSingle.swaggerSchema,
		zodSchema: media.getSingle.zodSchema,
		controller: media.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			contentLocale: true,
		},
		swaggerSchema: media.getMultiple.swaggerSchema,
		zodSchema: media.getMultiple.zodSchema,
		controller: media.getMultiple.controller,
	});

	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		isMultipart: true,
		swaggerSchema: media.uploadSingle.swaggerSchema,
		zodSchema: media.uploadSingle.zodSchema,
		controller: media.uploadSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:id",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		isMultipart: true,
		swaggerSchema: media.updateSingle.swaggerSchema,
		zodSchema: media.updateSingle.zodSchema,
		controller: media.updateSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: media.deleteSingle.swaggerSchema,
		zodSchema: media.deleteSingle.zodSchema,
		controller: media.deleteSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id/processed",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: media.clearSingleProcessed.swaggerSchema,
		zodSchema: media.clearSingleProcessed.zodSchema,
		controller: media.clearSingleProcessed.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/processed",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: media.clearAllProcessed.swaggerSchema,
		zodSchema: media.clearAllProcessed.zodSchema,
		controller: media.clearAllProcessed.controller,
	});
};

export default mediaRoutes;
