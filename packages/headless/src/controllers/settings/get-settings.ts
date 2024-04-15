import T from "../../translations/index.js";
import settingsSchema from "../../schemas/settings.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import settingsServices from "../../services/settings/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import SettingsFormatter from "../../libs/formatters/settings.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getSettingsController: ControllerT<
	typeof settingsSchema.getSettings.params,
	typeof settingsSchema.getSettings.body,
	typeof settingsSchema.getSettings.query
> = async (request, reply) => {
	try {
		const settings = await serviceWrapper(
			settingsServices.getSettings,
			false,
		)({
			db: request.server.config.db.client,
			config: request.server.config,
		});

		reply.status(200).send(
			await buildResponse(request, {
				data: settings,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("settings"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
				data: SettingsFormatter.swagger,
			}),
		},
	},
};
