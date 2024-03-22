import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteMultipleController: ControllerT<
	typeof multipleBuilderSchema.deleteMultiple.params,
	typeof multipleBuilderSchema.deleteMultiple.body,
	typeof multipleBuilderSchema.deleteMultiple.query
> = async (request, reply) => {
	await serviceWrapper(multipleBuilderServices.deleteMultiple, true)(
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
	zodSchema: multipleBuilderSchema.deleteMultiple,
	swaggerSchema: {
		description:
			"Delete a multiple pages from the multiple-builder collection type.",
		tags: ["collection-multiple-builder"],
		summary: "Delete multiple builder pages.",
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
