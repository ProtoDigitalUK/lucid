import settingsSchema from "../../schemas/settings.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import settingsServices from "../../services/settings/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerSettingsRes } from "../../format/format-settings.js";

const getSettingsController: ControllerT<
	typeof settingsSchema.getSettings.params,
	typeof settingsSchema.getSettings.body,
	typeof settingsSchema.getSettings.query
> = async (request, reply) => {
	const settings = await serviceWrapper(
		settingsServices.getSettings,
		false,
	)({
		db: request.server.db,
	});

	reply.status(200).send(
		await buildResponse(request, {
			data: settings,
		}),
	);
};

export default {
	controller: getSettingsController,
	zodSchema: settingsSchema.getSettings,
	swaggerSchema: {
		description: "Returns the settings",
		tags: ["settings"],
		summary: "Get settings",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerSettingsRes,
			}),
		},
	},
};
