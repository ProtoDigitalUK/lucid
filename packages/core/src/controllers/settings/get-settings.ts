import T from "../../translations/index.js";
import settingsSchema from "../../schemas/settings.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import SettingsFormatter from "../../libs/formatters/settings.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getSettingsController: RouteController<
	typeof settingsSchema.getSettings.params,
	typeof settingsSchema.getSettings.body,
	typeof settingsSchema.getSettings.query
> = async (request, reply) => {
	const settings = await serviceWrapper(LucidServices.setting.getSettings, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("settings"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		},
	})({
		db: request.server.config.db.client,
		config: request.server.config,
	});
	if (settings.error) throw new LucidAPIError(settings.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: settings.data,
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
				data: SettingsFormatter.swagger,
			}),
		},
	},
};
