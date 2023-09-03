"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const ProcessedImage_1 = __importDefault(require("../../db/models/ProcessedImage"));
const Config_1 = __importDefault(require("../Config"));
const getSingleCount = async (client, data) => {
    const limit = Config_1.default.media.processedImageLimit;
    const count = await ProcessedImage_1.default.getAllByMediaKeyCount(client, {
        media_key: data.key,
    });
    if (count >= limit) {
        throw new error_handler_1.LucidError({
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