import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof multipleBuilderSchema.deleteSingle.params,
	typeof multipleBuilderSchema.deleteSingle.body,
	typeof multipleBuilderSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(multipleBuilderServices.deleteSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
			user_id: request.auth.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: multipleBuilderSchema.deleteSingle,
	swaggerSchema: {
		description:
			"Delete a single page from the multiple-builder collection type.",
		tags: ["collection-multiple-builder"],
		summary: "Delete a single page",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
