import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerMultipleBuilderResT } from "../../format/format-multiple-builder.js";

const getSingleController: ControllerT<
	typeof multipleBuilderSchema.getSingle.params,
	typeof multipleBuilderSchema.getSingle.body,
	typeof multipleBuilderSchema.getSingle.query
> = async (request, reply) => {
	const page = await serviceWrapper(multipleBuilderServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
			query: request.query,
			language_id: request.language.id,
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
	zodSchema: multipleBuilderSchema.getSingle,
	swaggerSchema: {
		description: "Get a single multiple-builder entry.",
		tags: ["collection-multiple-builder"],
		summary: "Get a single multiple-builder entry.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerMultipleBuilderResT,
			}),
		},
		querystring: swaggerQueryString({
			include: ["bricks"],
		}),
	},
};
