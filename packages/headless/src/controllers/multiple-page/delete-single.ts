import multiplePageSchema from "../../schemas/multiple-page.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multiplePageServices from "../../services/multiple-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof multiplePageSchema.deleteSingle.params,
	typeof multiplePageSchema.deleteSingle.body,
	typeof multiplePageSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(multiplePageServices.deleteSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
			user_id: request.auth.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: multiplePageSchema.deleteSingle,
	swaggerSchema: {
		description:
			"Delete a single page from the multiple-page collection type.",
		tags: ["collection-multiple-page"],
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
