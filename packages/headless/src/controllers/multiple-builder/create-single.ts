import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerMultipleBuilderResT } from "../../format/format-multiple-builder.js";

const createSingleController: ControllerT<
	typeof multipleBuilderSchema.createSingle.params,
	typeof multipleBuilderSchema.createSingle.body,
	typeof multipleBuilderSchema.createSingle.query
> = async (request, reply) => {
	const pageId = await serviceWrapper(
		multipleBuilderServices.createSingle,
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
			published: request.body.published,
			parent_id: request.body.parent_id,
			category_ids: request.body.category_ids,
			title_translations: request.body.title_translations,
			excerpt_translations: request.body.excerpt_translations,
		},
	);

	const page = await serviceWrapper(multipleBuilderServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			id: pageId,
			query: {
				include: [],
			},
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: page,
		}),
	);
};

export default {
	controller: createSingleController,
	zodSchema: multipleBuilderSchema.createSingle,
	swaggerSchema: {
		description: "Creates a single multiple-builder entry.",
		tags: ["collection-multiple-builder"],
		summary: "Create a single multiple-builder entry.",
		body: {
			type: "object",
			properties: {
				collection_key: {
					type: "string",
				},
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
							},
						},
					},
				},
			},
			required: ["collection_key", "slug", "title_translations"],
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerMultipleBuilderResT,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
