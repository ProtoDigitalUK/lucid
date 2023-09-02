"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../media"));
const s3_1 = __importDefault(require("../s3"));
const processed_images_1 = __importDefault(require("../processed-images"));
const deleteSingle = async (client, data) => {
    await (0, service_1.default)(processed_images_1.default.clearSingle, false, client)({
        key: data.key,
    });
    const media = await Media_1.default.deleteSingle(client, {
        key: data.key,
    });
    if (!media) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Media not found",
            message: "Media not found",
            status: 404,
        });
    }
    await s3_1.default.deleteObject({
        key: media.key,
    });
    await (0, service_1.default)(media_1.default.setStorageUsed, false, client)({
        add: 0,
        minus: media.file_size,
    });
    return undefined;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map