import mediaSchema from "../../schemas/media.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerMediaRes } from "../../format/format-media.js";

const getMultipleController: ControllerT<
	typeof mediaSchema.getMultiple.params,
	typeof mediaSchema.getMultiple.body,
	typeof mediaSchema.getMultiple.query
> = async (request, reply) => {
	const media = await serviceWrapper(mediaServices.getMultiple, false)(
		{
			db: request.server.db,
		},
		{
			query: request.query,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: media.data,
			pagination: {
				count: media.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: mediaSchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple media items.",
		tags: ["media"],
		summary: "Get a multiple media items.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerMediaRes,
				},
				paginated: true,
			}),
		},
	},
};
