import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof rolesSchema.updateSingle.params,
	typeof rolesSchema.updateSingle.body,
	typeof rolesSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(rolesServices.updateSingle, true)(
		{
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
			name: request.body.name,
			description: request.body.description,
			permissions: request.body.permissions,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: rolesSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single role with the given name and permission groups.",
		tags: ["roles"],
		summary: "Update a single role",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				description: {
					type: "string",
				},
				permissions: {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
