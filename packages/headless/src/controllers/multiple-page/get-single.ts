import multiplePageSchema from "../../schemas/multiple-page.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger/response-helpers.js";
import multiplePageServices from "../../services/multiple-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggermultiplePageRes } from "../../format/format-multiple-page.js";

const getSingleController: ControllerT<
	typeof multiplePageSchema.getSingle.params,
	typeof multiplePageSchema.getSingle.body,
	typeof multiplePageSchema.getSingle.query
> = async (request, reply) => {
	const page = await serviceWrapper(multiplePageServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
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
	zodSchema: multiplePageSchema.getSingle,
	swaggerSchema: {
		description: "Get a single multiple-page entry.",
		tags: ["collection-multiple-page"],
		summary: "Get a single multiple-page entry.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggermultiplePageRes,
			}),
		},
		querystring: swaggerQueryString({
			include: ["bricks"],
		}),
	},
};
