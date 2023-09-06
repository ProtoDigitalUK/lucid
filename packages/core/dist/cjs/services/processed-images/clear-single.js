"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const ProcessedImage_js_1 = __importDefault(require("../../db/models/ProcessedImage.js"));
const index_js_1 = __importDefault(require("../s3/index.js"));
const index_js_2 = __importDefault(require("../media/index.js"));
const clearSingle = async (client, data) => {
    const media = await (0, service_js_1.default)(index_js_2.default.getSingle, false, client)({
        id: data.id,
    });
    const processedImages = await ProcessedImage_js_1.default.getAllByMediaKey(client, {
        media_key: media.key,
    });
    if (processedImages.length > 0) {
        await index_js_1.default.deleteObjects({
            objects: processedImages.map((processedImage) => ({
                key: processedImage.key,
            })),
        });
        await ProcessedImage_js_1.default.deleteAllByMediaKey(client, {
            media_key: media.key,
        });
    }
    return;
};
exports.default = clearSingle;
//# sourceMappingURL=clear-single.js.map