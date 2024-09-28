import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import collectionDocuments from "../../../controllers/collection-documents/index.js";

const collectionDocumentsRoutes = async (fastify: FastifyInstance) => {
	// Create draft document
	r(fastify, {
		method: "post",
		url: "/:collectionKey/draft",
		permissions: ["create_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.createDraft.swaggerSchema,
		zodSchema: collectionDocuments.createDraft.zodSchema,
		controller: collectionDocuments.createDraft.controller,
	});

	// Update draft document
	r(fastify, {
		method: "post",
		url: "/:collectionKey/:id/draft",
		permissions: ["update_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.updateDraft.swaggerSchema,
		zodSchema: collectionDocuments.updateDraft.zodSchema,
		controller: collectionDocuments.updateDraft.controller,
	});

	// Publish document
	r(fastify, {
		method: "post",
		url: "/:collectionKey/:id/publish",
		permissions: ["publish_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.updatePublish.swaggerSchema,
		zodSchema: collectionDocuments.updatePublish.zodSchema,
		controller: collectionDocuments.updatePublish.controller,
	});

	// Restore revision
	r(fastify, {
		method: "post",
		url: "/:collectionKey/:id/:versionId/restore-revision",
		permissions: ["restore_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.restoreRevision.swaggerSchema,
		zodSchema: collectionDocuments.restoreRevision.zodSchema,
		controller: collectionDocuments.restoreRevision.controller,
	});

	// Get single document
	r(fastify, {
		method: "get",
		url: "/:collectionKey/:id/:statusOrId",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: collectionDocuments.getSingle.swaggerSchema,
		zodSchema: collectionDocuments.getSingle.zodSchema,
		controller: collectionDocuments.getSingle.controller,
	});

	// Delete single document
	r(fastify, {
		method: "delete",
		url: "/:collectionKey/:id",
		permissions: ["delete_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.deleteSingle.swaggerSchema,
		zodSchema: collectionDocuments.deleteSingle.zodSchema,
		controller: collectionDocuments.deleteSingle.controller,
	});

	// Delete multiple documents
	r(fastify, {
		method: "delete",
		url: "/:collectionKey",
		permissions: ["delete_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: collectionDocuments.deleteMultiple.swaggerSchema,
		zodSchema: collectionDocuments.deleteMultiple.zodSchema,
		controller: collectionDocuments.deleteMultiple.controller,
	});

	// Get multiple documents
	r(fastify, {
		method: "get",
		url: "/:collectionKey/:status",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: collectionDocuments.getMultiple.swaggerSchema,
		zodSchema: collectionDocuments.getMultiple.zodSchema,
		controller: collectionDocuments.getMultiple.controller,
	});
};

export default collectionDocumentsRoutes;
