import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
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
			contentLanguage: true,
		},
		swaggerSchema: media.getMultiple.swaggerSchema,
		zodSchema: media.getMultiple.zodSchema,
		controller: media.getMultiple.controller,
	});

	r(fastify, {
		method: "post",
		url: "",
		permissions: {
			global: ["create_media"],
		},
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
		method: "delete",
		url: "/:id",
		permissions: {
			global: ["delete_media"],
		},
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
		url: "/:key/processed",
		permissions: {
			global: ["update_media"],
		},
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
		permissions: {
			global: ["update_media"],
		},
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
