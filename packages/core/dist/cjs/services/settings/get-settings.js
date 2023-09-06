"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../options/index.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const ProcessedImage_js_1 = __importDefault(require("../../db/models/ProcessedImage.js"));
const getSettings = async (client) => {
    const [mediaStorageUsed, processedImagesCount] = await Promise.all([
        (0, service_js_1.default)(index_js_1.default.getByName, false, client)({
            name: "media_storage_used",
        }),
        ProcessedImage_js_1.default.getAllCount(client),
    ]);
    return {
        media: {
            storage_used: mediaStorageUsed.media_storage_used || null,
            storage_limit: Config_js_1.default.media.storageLimit,
            storage_remaining: mediaStorageUsed.media_storage_used
                ? Config_js_1.default.media.storageLimit - mediaStorageUsed.media_storage_used
                : null,
            processed_images: {
                per_image_limit: Config_js_1.default.media.processedImageLimit,
                total: processedImagesCount,
            },
        },
    };
};
exports.default = getSettings;
//# sourceMappingURL=get-settings.js.map