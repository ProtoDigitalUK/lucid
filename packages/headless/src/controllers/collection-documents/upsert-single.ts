import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { swaggerBodyBricksObj } from "../../schemas/collection-bricks.js";
import { swaggerFieldObj } from "../../schemas/collection-fields.js";
import buildResponse from "../../utils/build-response.js";

const upsertSingleController: ControllerT<
	typeof collectionDocumentsSchema.upsertSingle.params,
	typeof collectionDocumentsSchema.upsertSingle.body,
	typeof collectionDocumentsSchema.upsertSingle.query
> = async (request, reply) => {
	const documentId = await serviceWrapper(
		collectionDocumentsServices.upsertSingle,
		true,
	)(
		{
			config: request.server.config,
		},
		{
			collection_key: request.params.collection_key,
			document_id: request.body.document_id,
			user_id: request.auth.id,
			slug: request.body.slug,
			homepage: request.body.homepage,
			parent_id: request.body.parent_id,
			category_ids: request.body.category_ids,
			bricks: request.body.bricks,
			fields: request.body.fields,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: {
				id: documentId,
			},
		}),
	);
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
				fields: {
					type: "array",
					items: swaggerFieldObj,
				},
			},
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						id: {
							type: "number",
						},
					},
				},
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
