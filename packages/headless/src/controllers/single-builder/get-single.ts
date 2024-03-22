import singleBuilderSchema from "../../schemas/single-builder.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import singleBuilderServices from "../../services/single-builder/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerSingleBuilderRes } from "../../format/format-single-builder.js";

const getSingleController: ControllerT<
	typeof singleBuilderSchema.getSingle.params,
	typeof singleBuilderSchema.getSingle.body,
	typeof singleBuilderSchema.getSingle.query
> = async (request, reply) => {
	const page = await serviceWrapper(singleBuilderServices.getSingle, false)(
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
	zodSchema: singleBuilderSchema.getSingle,
	swaggerSchema: {
		description: "Get a single-builder entry.",
		tags: ["collection-single-builder"],
		summary: "Get a single-builder entry.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerSingleBuilderRes,
			}),
		},
	},
};
