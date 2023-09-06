"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const ProcessedImage_js_1 = __importDefault(require("../../db/models/ProcessedImage.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const getSingleCount = async (client, data) => {
    const limit = Config_js_1.default.media.processedImageLimit;
    const count = await ProcessedImage_js_1.default.getAllByMediaKeyCount(client, {
        media_key: data.key,
    });
    if (count >= limit) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Processed image limit reached",
            message: `The processed image limit of ${limit} has been reached for this image.`,
            status: 400,
        });
    }
    return count;
};
exports.default = getSingleCount;
//# sourceMappingURL=get-single-count.js.map