import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { swaggerBodyBricksObj } from "../../schemas/bricks.js";

const upsertSingleController: ControllerT<
	typeof collectionDocumentsSchema.upsertSingle.params,
	typeof collectionDocumentsSchema.upsertSingle.body,
	typeof collectionDocumentsSchema.upsertSingle.query
> = async (request, reply) => {
	const document = await serviceWrapper(
		collectionDocumentsServices.upsertSingle,
		true,
	)(
		{
			db: request.server.db,
		},
		{
			collection_key: request.body.collection_key,
			user_id: request.auth.id,
			slug: request.body.slug,
			homepage: request.body.homepage,
			parent_id: request.body.parent_id,
			category_ids: request.body.category_ids,
			bricks: request.body.bricks,
		},
	);

	reply.status(204).send();
};

export default {
	controller: upsertSingleController,
	zodSchema: collectionDocumentsSchema.upsertSingle,
	swaggerSchema: {
		description: "Create or update a single collection document.",
		tags: ["collection-documents"],
		summary: "Create or update a single collection document.",
		body: {
			type: "object",
			properties: {
				collection_key: {
					type: "string",
				},
				document_id: {
					type: "number",
				},
				slug: {
					type: "string",
				},
				homepage: {
					type: "boolean",
				},
				parent_id: {
					type: "number",
					nullable: true,
				},
				category_ids: {
					type: "array",
					items: {
						type: "number",
					},
				},
				bricks: {
					type: "array",
					items: swaggerBodyBricksObj,
				},
			},
			required: ["collection_key"],
		},
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
