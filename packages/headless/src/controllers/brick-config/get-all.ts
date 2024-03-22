import bricksSchema from "../../schemas/bricks.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger/response-helpers.js";
import buildResponse from "../../utils/app/build-response.js";
import brickConfigServices from "../../services/brick-config/index.js";
import { swaggerBrickConfigsRes } from "../../format/format-brick-config.js";

const getAllController: ControllerT<
	typeof bricksSchema.getAll.params,
	typeof bricksSchema.getAll.body,
	typeof bricksSchema.getAll.query
> = async (request, reply) => {
	const bricks = await brickConfigServices.getAll({
		query: request.query,
	});

	reply.status(200).send(
		await buildResponse(request, {
			data: bricks,
		}),
	);
};

export default {
	controller: getAllController,
	zodSchema: bricksSchema.getAll,
	swaggerSchema: {
		description:
			"Returns all brick instance's config data. This is used by the page builder to render the different custom fields.",
		tags: ["brick-config"],
		summary: "Get all brick config data",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerBrickConfigsRes,
				},
			}),
		},
		querystring: swaggerQueryString({
			include: ["fields"],
			filters: [
				{
					key: "collection_key",
				},
			],
		}),
	},
};
