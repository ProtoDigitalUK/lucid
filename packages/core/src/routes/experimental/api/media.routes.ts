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
		swaggerSchema: media.getPresignedUrl.swaggerSchema,
		zodSchema: media.getPresignedUrl.zodSchema,
		controller: media.getPresignedUrl.controller,
	});
};

export default mediaRoutes;
