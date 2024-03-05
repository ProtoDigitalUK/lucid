import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import collections from "../../../controllers/collections/index.js";

const collectionRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_collection"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collections.createSingle.swaggerSchema,
		zodSchema: collections.createSingle.zodSchema,
		controller: collections.createSingle.controller,
	});
	r(fastify, {
		method: "get",
		url: "/:key",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: collections.getSingle.swaggerSchema,
		zodSchema: collections.getSingle.zodSchema,
		controller: collections.getSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:key",
		permissions: ["delete_collection"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collections.deleteSingle.swaggerSchema,
		zodSchema: collections.deleteSingle.zodSchema,
		controller: collections.deleteSingle.controller,
	});
};

export default collectionRoutes;
