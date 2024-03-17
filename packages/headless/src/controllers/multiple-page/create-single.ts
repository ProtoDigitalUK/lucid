import multiplePageSchema from "../../schemas/multiple-page.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multiplePageServices from "../../services/multiple-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerMultiplePageRes } from "../../format/format-multiple-page.js";

const createSingleController: ControllerT<
	typeof multiplePageSchema.createSingle.params,
	typeof multiplePageSchema.createSingle.body,
	typeof multiplePageSchema.createSingle.query
> = async (request, reply) => {
	const pageId = await serviceWrapper(
		multiplePageServices.createSingle,
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

	const page = await serviceWrapper(multiplePageServices.getSingle, false)(
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
	zodSchema: multiplePageSchema.createSingle,
	swaggerSchema: {
		description: "Creates a single multiple-page entry.",
		tags: ["collection-multiple-page"],
		summary: "Create a single multiple-page entry.",
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
				data: swaggerMultiplePageRes,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
