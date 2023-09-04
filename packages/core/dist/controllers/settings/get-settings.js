"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const settings_1 = __importDefault(require("../../schemas/settings"));
const settings_2 = __importDefault(require("../../services/settings"));
const getSettingsController = async (req, res, next) => {
    try {
        const settings = await (0, service_1.default)(settings_2.default.getSettings, false)();
        res.status(200).json((0, build_response_1.default)(req, {
            data: settings,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: settings_1.default.getSettings,
    controller: getSettingsController,
};
//# sourceMappingURL=get-settings.js.map