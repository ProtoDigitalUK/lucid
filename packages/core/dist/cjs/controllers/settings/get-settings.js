"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const settings_js_1 = __importDefault(require("../../schemas/settings.js"));
const index_js_1 = __importDefault(require("../../services/settings/index.js"));
const getSettingsController = async (req, res, next) => {
    try {
        const settings = await (0, service_js_1.default)(index_js_1.default.getSettings, false)();
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: settings,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: settings_js_1.default.getSettings,
    controller: getSettingsController,
};
//# sourceMappingURL=get-settings.js.map