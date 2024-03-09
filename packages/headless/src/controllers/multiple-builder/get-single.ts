import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger/response-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerMultipleBuilderRes } from "../../format/format-multiple-builder.js";

const getSingleController: ControllerT<
	typeof multipleBuilderSchema.getSingle.params,
	typeof multipleBuilderSchema.getSingle.body,
	typeof multipleBuilderSchema.getSingle.query
> = async (request, reply) => {
	const document = await serviceWrapper(
		multipleBuilderServices.getSingle,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
			query: request.query,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: document,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: multipleBuilderSchema.getSingle,
	swaggerSchema: {
		description: "Get a single multiple-builder document.",
		tags: ["collection-multiple-builder"],
		summary: "Get a single multiple-builder document.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerMultipleBuilderRes,
			}),
		},
		querystring: swaggerQueryString({
			include: ["bricks"],
		}),
	},
};
