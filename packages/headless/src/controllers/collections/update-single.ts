import collectionsSchema from "../../schemas/collections.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof collectionsSchema.updateSingle.params,
	typeof collectionsSchema.updateSingle.body,
	typeof collectionsSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(collectionsServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			key: request.params.key,
			title: request.body.title,
			singular: request.body.singular,
			description: request.body.description,
			disableHomepages: request.body.disable_homepages,
			disableParents: request.body.disable_parents,
			bricks: request.body.bricks,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: collectionsSchema.updateSingle,
	swaggerSchema: {
		description: "Update a single collection instance.",
		tags: ["collections"],
		summary: "Update a collection",
		body: {
			type: "object",
			properties: {
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
