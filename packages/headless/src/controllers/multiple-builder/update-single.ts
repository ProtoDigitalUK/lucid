import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import { swaggerBodyBricksObj } from "../../schemas/bricks.js";

const updateSingleController: ControllerT<
	typeof multipleBuilderSchema.updateSingle.params,
	typeof multipleBuilderSchema.updateSingle.body,
	typeof multipleBuilderSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(multipleBuilderServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
			slug: request.body.slug,
			homepage: request.body.homepage,
			published: request.body.published,
			parent_id: request.body.parent_id,
			category_ids: request.body.category_ids,
			title_translations: request.body.title_translations,
			excerpt_translations: request.body.excerpt_translations,
			bricks: request.body.bricks,
			user_id: request.auth?.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: multipleBuilderSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single page from the multiple-builder collection type.",
		tags: ["collection-multiple-builder"],
		summary: "Update a single page",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				slug: {
					type: "string",
				},
				homepage: {
					type: "boolean",
				},
				published: {
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
				title_translations: {
					type: "array",
					items: {
						type: "object",
						properties: {
							language_id: {
								type: "number",
							},
							value: {
								type: "string",
								nullable: true,
							},
						},
					},
				},
				excerpt_translations: {
					type: "array",
					items: {
						type: "object",
						properties: {
							language_id: {
								type: "number",
							},
							value: {
								type: "string",
								nullable: true,
							},
						},
					},
				},
				bricks: {
					type: "array",
					items: swaggerBodyBricksObj,
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
