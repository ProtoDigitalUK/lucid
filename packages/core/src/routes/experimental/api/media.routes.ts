import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import media from "../../../controllers/media/index.js";

const mediaRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "/presigned-url",
		permissions: ["create_media", "update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: media.getPresignedUrl.swaggerSchema,
		zodSchema: media.getPresignedUrl.zodSchema,
		controller: media.getPresignedUrl.controller,
	});

	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: media.createSingle.swaggerSchema,
		zodSchema: media.createSingle.zodSchema,
		controller: media.createSingle.controller,
	});
};

export default mediaRoutes;
