"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProcessedImage_1 = __importDefault(require("../../db/models/ProcessedImage"));
const s3_1 = __importDefault(require("../s3"));
const clearSingle = async (client, data) => {
    const processedImages = await ProcessedImage_1.default.getAllByMediaKey(client, {
        media_key: data.key,
    });
    await s3_1.default.deleteObjects({
        objects: processedImages.map((processedImage) => ({
            key: processedImage.key,
        })),
    });
    await ProcessedImage_1.default.deleteAllByMediaKey(client, {
        media_key: data.key,
    });
    return;
};
exports.default = clearSingle;
//# sourceMappingURL=clear-single.js.map