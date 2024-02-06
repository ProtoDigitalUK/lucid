import environmentsSchema from "../../schemas/environments.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import environments from "../../services/environments/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerEnvironmentRes } from "../../format/format-environment.js";

const createSingleController: ControllerT<
	typeof environmentsSchema.createSingle.params,
	typeof environmentsSchema.createSingle.body,
	typeof environmentsSchema.createSingle.query
> = async (request, reply) => {
	const key = await serviceWrapper(environments.createSingle, true)(
		{
			db: request.server.db,
		},
		{
			key: request.body.key,
			title: request.body.title,
			assignedBricks: request.body.assigned_bricks,
			assignedCollections: request.body.assigned_collections,
		},
	);

	const environment = await serviceWrapper(environments.getSingle, true)(
		{
			db: request.server.db,
		},
		{
			key: key,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: environment,
		}),
	);
};

export default {
	controller: createSingleController,
	zodSchema: environmentsSchema.createSingle,
	swaggerSchema: {
		description:
			"Creates a new environment. Environments are used to to group collection content, menus and form content together. For example, you might have a 'staging' and a 'production' environment.",
		tags: ["environments"],
		summary: "Create a new environment",
		body: {
			type: "object",
			description:
				"Key should be unique and only contain lowercase letters and dashes. For example: 'staging' or 'production'. <br> Title is a human readable name for the environment. For example: 'Staging' or 'Production'. <br> Assigned bricks and collections should be an array of keys. These keys should match those that you have defined in the collection and brick builder.",
			properties: {
				key: { type: "string", default: "production" },
				title: { type: "string", default: "Production" },
				assigned_bricks: {
					type: "array",
					items: { type: "string", default: "hero" },
				},
				assigned_collections: {
					type: "array",
					items: { type: "string", default: "articles" },
				},
			},
			required: ["key", "title"],
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerEnvironmentRes,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
