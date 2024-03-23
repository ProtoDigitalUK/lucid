import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import collectionDocuments from "../../../controllers/collection-documents/index.js";

const collectionDocumentsRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["update_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.upsertSingle.swaggerSchema,
		zodSchema: collectionDocuments.upsertSingle.zodSchema,
		controller: collectionDocuments.upsertSingle.controller,
	});
};

export default collectionDocumentsRoutes;
