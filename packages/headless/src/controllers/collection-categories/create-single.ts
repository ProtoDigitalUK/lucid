import collectionCategoriesSchema from "../../schemas/collection-categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionCategoriesServices from "../../services/collection-categories/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerCategoryRes } from "../../format/format-collection-categories.js";

const createSingleController: ControllerT<
	typeof collectionCategoriesSchema.createSingle.params,
	typeof collectionCategoriesSchema.createSingle.body,
	typeof collectionCategoriesSchema.createSingle.query
> = async (request, reply) => {
	const id = await serviceWrapper(
		collectionCategoriesServices.createSingle,
		true,
	)(
		{
			config: request.server.config,
		},
		{
			collection_key: request.body.collection_key,
			slug: request.body.slug,
			title_translations: request.body.title_translations,
			description_translations: request.body.description_translations,
		},
	);

	const category = await serviceWrapper(
		collectionCategoriesServices.getSingle,
		false,
	)(
		{
			config: request.server.config,
		},
		{
			id,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: category,
		}),
	);
};

export default {
	controller: createSingleController,
	zodSchema: collectionCategoriesSchema.createSingle,
	swaggerSchema: {
		description:
			"Creates a new collection category. These can be assigned to pages that belong to the multiple builder collection type.",
		tags: ["collection-categories"],
		summary: "Create a collection category",
		body: {
			type: "object",
			properties: {
				collection_key: {
					type: "string",
				},
				slug: {
					type: "string",
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
				description_translations: {
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
				data: swaggerCategoryRes,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
