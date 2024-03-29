import collectionCategoriesSchema from "../../schemas/collection-categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionCategoriesServices from "../../services/collection-categories/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof collectionCategoriesSchema.updateSingle.params,
	typeof collectionCategoriesSchema.updateSingle.body,
	typeof collectionCategoriesSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(collectionCategoriesServices.updateSingle, true)(
		{
			config: request.server.config,
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
	zodSchema: collectionCategoriesSchema.updateSingle,
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
