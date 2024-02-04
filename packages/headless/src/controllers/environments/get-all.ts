import environmentsSchema from "../../schemas/environments.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import environments from "../../services/environments/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";

const getAllController: ControllerT<
	typeof environmentsSchema.getAll.params,
	typeof environmentsSchema.getAll.body,
	typeof environmentsSchema.getAll.query
> = async (request, reply) => {
	const environmentsRes = await serviceWrapper(
		environments.getAll,
		false,
	)({
		db: request.server.db,
	});

	reply.status(200).send(
		await buildResponse(request, {
			data: environmentsRes,
		}),
	);
};

export default {
	controller: getAllController,
	zodSchema: environmentsSchema.getAll,
	swaggerSchema: {
		description: "Returns all environments.",
		tags: ["environments"],
		summary: "Get all environments",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							key: { type: "string", example: "production" },
							title: { type: "string", example: "Production" },
							assigned_bricks: {
								type: "array",
								example: ["hero-banner", "intro"],
							},
							assigned_collections: {
								type: "array",
								example: ["pages", "articles"],
							},
						},
					},
				},
			}),
		},
	},
};
