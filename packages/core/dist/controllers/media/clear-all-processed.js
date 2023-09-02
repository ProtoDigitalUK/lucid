"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const service_1 = __importDefault(require("../../utils/app/service"));
const media_1 = __importDefault(require("../../schemas/media"));
const processed_images_1 = __importDefault(require("../../services/processed-images"));
const clearAllProcessedController = async (req, res, next) => {
    try {
        await (0, service_1.default)(processed_images_1.default.clearAll, false)();
        res.status(200).json((0, build_response_1.default)(req, {
            data: undefined,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_1.default.clearAllProcessed,
    controller: clearAllProcessedController,
};
//# sourceMappingURL=clear-all-processed.js.map