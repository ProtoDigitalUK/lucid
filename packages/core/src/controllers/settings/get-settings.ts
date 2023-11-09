// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import settingsSchema from "@schemas/settings.js";
// Services
import settingsService from "@services/settings/index.js";

// --------------------------------------------------
// Controller
const getSettingsController: Controller<
  typeof settingsSchema.getSettings.params,
  typeof settingsSchema.getSettings.body,
  typeof settingsSchema.getSettings.query
> = async (request, reply) => {
  const settings = await service(settingsService.getSettings, false)();

  reply.status(200).send(
    buildResponse(request, {
      data: settings,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: settingsSchema.getSettings,
  controller: getSettingsController,
};
