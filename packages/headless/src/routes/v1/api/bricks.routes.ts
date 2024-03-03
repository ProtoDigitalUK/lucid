import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import brickConfig from "../../../controllers/brick-config/index.js";

const brickRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/config",
		middleware: {
			authenticate: true,
		},
		zodSchema: brickConfig.getAll.zodSchema,
		swaggerSchema: brickConfig.getAll.swaggerSchema,
		controller: brickConfig.getAll.controller,
	});

	r(fastify, {
		method: "get",
		url: "/config/:brick_key",
		middleware: {
			authenticate: true,
		},
		zodSchema: brickConfig.getSingle.zodSchema,
		swaggerSchema: brickConfig.getSingle.swaggerSchema,
		controller: brickConfig.getSingle.controller,
	});
};

export default brickRoutes;
