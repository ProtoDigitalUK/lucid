"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_js_1 = __importDefault(require("../../utils/media/helpers.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const index_js_2 = __importDefault(require("../processed-images/index.js"));
const streamMedia = async (data) => {
    if (data.query?.format === undefined &&
        data.query?.width === undefined &&
        data.query?.height === undefined) {
        return await index_js_1.default.getS3Object({
            key: data.key,
        });
    }
    const processKey = helpers_js_1.default.createProcessKey({
        key: data.key,
        query: data.query,
    });
    try {
        return await index_js_1.default.getS3Object({
            key: processKey,
        });
    }
    catch (err) {
        return await (0, service_js_1.default)(index_js_2.default.processImage, false)({
            key: data.key,
            processKey: processKey,
            options: data.query,
        });
    }
};
exports.default = streamMedia;
//# sourceMappingURL=stream-media.js.map