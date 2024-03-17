import singlePageSchema from "../../schemas/single-page.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import singlePageServices from "../../services/single-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerSinglePageRes } from "../../format/format-single-page.js";

const getSingleController: ControllerT<
	typeof singlePageSchema.getSingle.params,
	typeof singlePageSchema.getSingle.body,
	typeof singlePageSchema.getSingle.query
> = async (request, reply) => {
	const page = await serviceWrapper(singlePageServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			collection_key: request.params.collection_key,
			language_id: request.language.id,
			include_bricks: true,
			user_id: request.auth.id,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: page,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: singlePageSchema.getSingle,
	swaggerSchema: {
		description: "Get a single-page entry.",
		tags: ["collection-single-page"],
		summary: "Get a single-page entry.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerSinglePageRes,
			}),
		},
	},
};
