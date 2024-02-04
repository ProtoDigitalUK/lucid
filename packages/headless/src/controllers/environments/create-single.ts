import environmentsSchema from "../../schemas/environments.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import environments from "../../services/environments/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const createSingleController: ControllerT<
	typeof environmentsSchema.createSingle.params,
	typeof environmentsSchema.createSingle.body,
	typeof environmentsSchema.createSingle.query
> = async (request, reply) => {
	await serviceWrapper(environments.createSingle, true)(
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
	reply.status(204).send();
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
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
