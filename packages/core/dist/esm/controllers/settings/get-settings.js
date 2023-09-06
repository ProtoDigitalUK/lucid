import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import settingsSchema from "../../schemas/settings.js";
import settingsService from "../../services/settings/index.js";
const getSettingsController = async (req, res, next) => {
    try {
        const settings = await service(settingsService.getSettings, false)();
        res.status(200).json(buildResponse(req, {
            data: settings,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: settingsSchema.getSettings,
    controller: getSettingsController,
};
//# sourceMappingURL=get-settings.js.map