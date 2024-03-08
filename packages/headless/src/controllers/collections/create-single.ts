import collectionsSchema from "../../schemas/collections.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerCollectionRes } from "../../format/format-collection.js";

const createSingleController: ControllerT<
	typeof collectionsSchema.createSingle.params,
	typeof collectionsSchema.createSingle.body,
	typeof collectionsSchema.createSingle.query
> = async (request, reply) => {
	const collectionKey = await serviceWrapper(
		collectionsServices.createSingle,
		true,
	)(
		{
			db: request.server.db,
		},
		{
			key: request.body.key,
			type: request.body.type,
			slug: request.body.slug,
			title: request.body.title,
			singular: request.body.singular,
			description: request.body.description,
			disable_homepages: request.body.disable_homepages,
			disable_parents: request.body.disable_parents,
			bricks: request.body.bricks,
		},
	);

	const collection = await serviceWrapper(
		collectionsServices.getSingle,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			key: collectionKey,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: collection,
		}),
	);
};

export default {
	controller: createSingleController,
	zodSchema: collectionsSchema.createSingle,
	swaggerSchema: {
		description: "Creates a single collection instance.",
		tags: ["collections"],
		summary: "Create a collection",
		body: {
			type: "object",
			properties: {
				key: {
					type: "string",
				},
				type: {
					type: "string",
					enum: ["multiple-builder", "single-builder"],
				},
				slug: {
					type: "string",
				},
				title: {
					type: "string",
				},
				singular: {
					type: "string",
				},
				description: {
					type: "string",
				},
				disable_homepages: {
					type: "boolean",
				},
				disable_parents: {
					type: "boolean",
				},
				bricks: {
					type: "array",
					items: {
						type: "object",
						properties: {
							key: {
								type: "string",
							},
							type: {
								type: "string",
								enum: ["builder", "fixed"],
							},
							position: {
								type: "string",
								enum: ["top", "bottom", "sidebar"],
							},
						},
						required: ["key", "type"],
					},
				},
			},
			required: ["key", "type", "title", "singular"],
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerCollectionRes,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
