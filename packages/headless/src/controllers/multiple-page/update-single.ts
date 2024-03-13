import multiplePageSchema from "../../schemas/multiple-page.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multiplePageServices from "../../services/multiple-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof multiplePageSchema.updateSingle.params,
	typeof multiplePageSchema.updateSingle.body,
	typeof multiplePageSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(multiplePageServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
			slug: request.body.slug,
			homepage: request.body.homepage,
			published: request.body.published,
			parent_id: request.body.parent_id,
			category_ids: request.body.category_ids,
			title_translations: request.body.title_translations,
			excerpt_translations: request.body.excerpt_translations,
			bricks: request.body.bricks,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: multiplePageSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single page from the multiple-page collection type.",
		tags: ["collection-multiple-page"],
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
					items: {
						type: "object",
						properties: {
							id: {
								type: ["number", "string"],
							},
							key: {
								type: "string",
							},
							order: {
								type: "number",
							},
							type: {
								type: "string",
							},
							groups: {
								type: "array",
								items: {
									type: "object",
									properties: {
										group_id: {
											type: ["number", "string"],
										},
										group_order: {
											type: "number",
										},
										parent_group_id: {
											type: ["number", "string"],
											nullable: true,
										},
										repeater_key: {
											type: "string",
										},
										language_id: {
											type: "number",
										},
									},
								},
							},
							fields: {
								type: "array",
								items: {
									type: "object",
									properties: {
										key: {
											type: "string",
										},
										type: {
											type: "string",
										},
										value: {
											type: [
												"number",
												"string",
												"boolean",
												"object",
												"null",
											],
											nullable: true,
										},
										language_id: {
											type: "number",
										},
										fields_id: {
											type: "number",
										},
										group_id: {
											type: ["number", "string"],
											nullable: true,
										},
									},
								},
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
