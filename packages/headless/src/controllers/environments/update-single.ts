import environmentsSchema from "../../schemas/environments.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import environments from "../../services/environments/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof environmentsSchema.updateSingle.params,
	typeof environmentsSchema.updateSingle.body,
	typeof environmentsSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(environments.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			key: request.params.key,
			data: {
				title: request.body.title,
				assignedBricks: request.body.assigned_bricks,
				assignedCollections: request.body.assigned_collections,
			},
		},
	);
	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: environmentsSchema.updateSingle,
	swaggerSchema: {
		description:
			"Used to update your environments title, assigned bricks and assigned collections.",
		tags: ["environments"],
		summary: "Update an environment",
		body: {
			type: "object",
			description:
				"Title is a human readable name for the environment. For example: 'Staging' or 'Production'. <br> Assigned bricks and collections should be an array of keys. These keys should match those that you have defined in the collection and brick builder.",
			properties: {
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
		},
		// ADD URL PARAMS
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
