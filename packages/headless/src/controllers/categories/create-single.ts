import categoriesSchema from "../../schemas/categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import categoriesServices from "../../services/categories/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerCategoryRes } from "../../format/format-category.js";

const createSingleController: ControllerT<
	typeof categoriesSchema.createSingle.params,
	typeof categoriesSchema.createSingle.body,
	typeof categoriesSchema.createSingle.query
> = async (request, reply) => {
	const id = await serviceWrapper(categoriesServices.createSingle, true)(
		{
			db: request.server.db,
		},
		{
			collection_key: request.body.collection_key,
			slug: request.body.slug,
			title_translations: request.body.title_translations,
			description_translations: request.body.description_translations,
		},
	);

	const category = await serviceWrapper(categoriesServices.getSingle, false)(
		{
			db: request.server.db,
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
	zodSchema: categoriesSchema.createSingle,
	swaggerSchema: {
		description:
			"Creates a new collection category. These can be assigned to pages that belong to the multiple-page collection type.",
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
