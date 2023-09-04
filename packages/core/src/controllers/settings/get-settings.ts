// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import settingsSchema from "@schemas/settings";
// Services
import settingsService from "@services/settings";

// --------------------------------------------------
// Controller
const getSettingsController: Controller<
  typeof settingsSchema.getSettings.params,
  typeof settingsSchema.getSettings.body,
  typeof settingsSchema.getSettings.query
> = async (req, res, next) => {
  try {
    const settings = await service(settingsService.getSettings, false)();

    res.status(200).json(
      buildResponse(req, {
        data: settings,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: settingsSchema.getSettings,
  controller: getSettingsController,
};
