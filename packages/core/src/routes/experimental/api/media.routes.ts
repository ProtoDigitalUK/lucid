import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import media from "../../../controllers/media/index.js";

const mediaRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "/presigned-url",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
		},
		swaggerSchema: media.clearAllProcessed.swaggerSchema,
		zodSchema: media.clearAllProcessed.zodSchema,
		controller: media.clearAllProcessed.controller,
	});
};

export default mediaRoutes;
