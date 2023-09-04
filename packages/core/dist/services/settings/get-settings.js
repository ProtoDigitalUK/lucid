"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const options_1 = __importDefault(require("../options"));
const Config_1 = __importDefault(require("../Config"));
const ProcessedImage_1 = __importDefault(require("../../db/models/ProcessedImage"));
const getSettings = async (client) => {
    const [mediaStorageUsed, processedImagesCount] = await Promise.all([
        (0, service_1.default)(options_1.default.getByName, false, client)({
            name: "media_storage_used",
        }),
        ProcessedImage_1.default.getAllCount(client),
    ]);
    return {
        media: {
            storage_used: mediaStorageUsed.media_storage_used || null,
            storage_limit: Config_1.default.media.storageLimit,
            storage_remaining: mediaStorageUsed.media_storage_used
                ? Config_1.default.media.storageLimit - mediaStorageUsed.media_storage_used
                : null,
            processed_images: {
                per_image_limit: Config_1.default.media.processedImageLimit,
                total: processedImagesCount,
            },
        },
    };
};
exports.default = getSettings;
//# sourceMappingURL=get-settings.js.map