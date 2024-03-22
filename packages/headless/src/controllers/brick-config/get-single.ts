import bricksSchema from "../../schemas/bricks.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import brickConfigServices from "../../services/brick-config/index.js";
import { swaggerBrickConfigsRes } from "../../format/format-brick-config.js";

const getSingleController: ControllerT<
	typeof bricksSchema.getSingle.params,
	typeof bricksSchema.getSingle.body,
	typeof bricksSchema.getSingle.query
> = async (request, reply) => {
	const brick = await serviceWrapper(brickConfigServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			brick_key: request.params.brick_key,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: brick,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: bricksSchema.getSingle,
	swaggerSchema: {
		description: "Returns a single brick instance's config data.",
		tags: ["brick-config"],
		summary: "Get a single brick's config data",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerBrickConfigsRes,
			}),
		},
	},
};
