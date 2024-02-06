import environmentsSchema from "../../schemas/environments.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import environments from "../../services/environments/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerEnvironmentRes } from "../../format/format-environment.js";

const getSingleController: ControllerT<
	typeof environmentsSchema.getSingle.params,
	typeof environmentsSchema.getSingle.body,
	typeof environmentsSchema.getSingle.query
> = async (request, reply) => {
	const environmentsRes = await serviceWrapper(environments.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			key: request.params.key,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: environmentsRes,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: environmentsSchema.getSingle,
	swaggerSchema: {
		description:
			"Returns a single environment based on the key URL paramater.",
		tags: ["environments"],
		summary: "Get a single environment",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerEnvironmentRes,
			}),
		},
	},
};
