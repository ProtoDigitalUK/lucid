import type { FastifyInstance } from "fastify";
import r from "../../../../utils/route.js";
import collectionDocuments from "../../../../controllers/collection-documents/index.js";

const clientDocumentsRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/document/:collectionKey",
		middleware: {
			clientAuthentication: true,
		},
		swaggerSchema: collectionDocuments.client.getSingle.swaggerSchema,
		zodSchema: collectionDocuments.client.getSingle.zodSchema,
		controller: collectionDocuments.client.getSingle.controller,
	});
};

export default clientDocumentsRoutes;
