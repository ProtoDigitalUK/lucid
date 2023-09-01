"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const media_1 = __importDefault(require("../media"));
const streamMedia = async (data) => {
    try {
        if (data.query?.format === undefined &&
            data.query?.width === undefined &&
            data.query?.height === undefined) {
            return await media_1.default.getS3Object({
                key: data.key,
            });
        }
        return await (0, service_1.default)(media_1.default.processImage, false)(data);
    }
    catch (err) {
        await media_1.default.streamErrorImage({
            fallback: data.query?.fallback,
            res: data.res,
        });
    }
};
exports.default = streamMedia;
//# sourceMappingURL=stream-media.js.map