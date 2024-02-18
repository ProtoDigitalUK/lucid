import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import media from "../../../controllers/media/index.js";

const mediaRoutes = async (fastify: FastifyInstance) => {
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
};

export default mediaRoutes;
