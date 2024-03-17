import multiplePageSchema from "../../schemas/multiple-page.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multiplePageServices from "../../services/multiple-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteMultipleController: ControllerT<
	typeof multiplePageSchema.deleteMultiple.params,
	typeof multiplePageSchema.deleteMultiple.body,
	typeof multiplePageSchema.deleteMultiple.query
> = async (request, reply) => {
	await serviceWrapper(multiplePageServices.deleteMultiple, true)(
		{
			db: request.server.db,
		},
		{
			ids: request.body.ids,
			user_id: request.auth.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteMultipleController,
	zodSchema: multiplePageSchema.deleteMultiple,
	swaggerSchema: {
		description:
			"Delete a multiple pages from the multiple-page collection type.",
		tags: ["collection-multiple-page"],
		summary: "Delete multiple pages",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				ids: {
					type: "array",
					items: {
						type: "number",
					},
				},
			},
			required: ["ids"],
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
