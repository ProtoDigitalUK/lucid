import categoriesSchema from "../../schemas/categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import categoriesServices from "../../services/categories/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof categoriesSchema.updateSingle.params,
	typeof categoriesSchema.updateSingle.body,
	typeof categoriesSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(categoriesServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
			slug: request.body.slug,
			title_translations: request.body.title_translations,
			description_translations: request.body.description_translations,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: categoriesSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single collection category with the given slug and translations.",
		tags: ["collection-categories"],
		summary: "Update a single collection category",
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
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
