"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../media"));
const s3_1 = __importDefault(require("../s3"));
const processed_images_1 = __importDefault(require("../processed-images"));
const deleteSingle = async (client, data) => {
    const media = await (0, service_1.default)(media_1.default.getSingle, false, client)({
        id: data.id,
    });
    await (0, service_1.default)(processed_images_1.default.clearSingle, false, client)({
        id: media.id,
    });
    await Media_1.default.deleteSingle(client, {
        key: media.key,
    });
    await s3_1.default.deleteObject({
        key: media.key,
    });
    await (0, service_1.default)(media_1.default.setStorageUsed, false, client)({
        add: 0,
        minus: media.meta.file_size,
    });
    return undefined;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map