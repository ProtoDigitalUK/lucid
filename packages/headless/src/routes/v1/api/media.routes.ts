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
		},
		permissions: {
			global: ["read_email"],
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
};

export default mediaRoutes;
