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

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: collectionDocuments.getSingle.swaggerSchema,
		zodSchema: collectionDocuments.getSingle.zodSchema,
		controller: collectionDocuments.getSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.deleteSingle.swaggerSchema,
		zodSchema: collectionDocuments.deleteSingle.zodSchema,
		controller: collectionDocuments.deleteSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "",
		permissions: ["delete_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.deleteMultiple.swaggerSchema,
		zodSchema: collectionDocuments.deleteMultiple.zodSchema,
		controller: collectionDocuments.deleteMultiple.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			contentLanguage: true,
		},
		swaggerSchema: collectionDocuments.getMultiple.swaggerSchema,
		zodSchema: collectionDocuments.getMultiple.zodSchema,
		controller: collectionDocuments.getMultiple.controller,
	});
};

export default collectionDocumentsRoutes;
