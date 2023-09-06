"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProcessedImage_js_1 = __importDefault(require("../../db/models/ProcessedImage.js"));
const index_js_1 = __importDefault(require("../s3/index.js"));
const clearAll = async (client) => {
    const processedImages = await ProcessedImage_js_1.default.getAll(client);
    if (processedImages.length > 0) {
        await index_js_1.default.deleteObjects({
            objects: processedImages.map((processedImage) => ({
                key: processedImage.key,
            })),
        });
        await ProcessedImage_js_1.default.deleteAll(client);
    }
    return;
};
exports.default = clearAll;
//# sourceMappingURL=clear-all.js.map