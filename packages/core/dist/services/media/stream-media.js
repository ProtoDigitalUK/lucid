"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/media/helpers"));
const service_1 = __importDefault(require("../../utils/app/service"));
const media_1 = __importDefault(require("../media"));
const streamMedia = async (data) => {
    if (data.query?.format === undefined &&
        data.query?.width === undefined &&
        data.query?.height === undefined) {
        return await media_1.default.getS3Object({
            key: data.key,
        });
    }
    const processKey = helpers_1.default.createProcessKey({
        key: data.key,
        query: data.query,
    });
    try {
        return await media_1.default.getS3Object({
            key: processKey,
        });
    }
    catch (err) {
        return await (0, service_1.default)(media_1.default.processImage, false)({
            key: data.key,
            processKey: processKey,
            options: data.query,
        });
    }
};
exports.default = streamMedia;
//# sourceMappingURL=stream-media.js.map