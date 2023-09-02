"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const ProcessedImage_1 = __importDefault(require("../../db/models/ProcessedImage"));
const s3_1 = __importDefault(require("../s3"));
const media_1 = __importDefault(require("../media"));
const clearSingle = async (client, data) => {
    const media = await (0, service_1.default)(media_1.default.getSingle, false, client)({
        id: data.id,
    });
    const processedImages = await ProcessedImage_1.default.getAllByMediaKey(client, {
        media_key: media.key,
    });
    if (processedImages.length > 0) {
        await s3_1.default.deleteObjects({
            objects: processedImages.map((processedImage) => ({
                key: processedImage.key,
            })),
        });
        await ProcessedImage_1.default.deleteAllByMediaKey(client, {
            media_key: media.key,
        });
    }
    return;
};
exports.default = clearSingle;
//# sourceMappingURL=clear-single.js.map