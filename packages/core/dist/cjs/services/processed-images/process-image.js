"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_js_1 = __importDefault(require("../../utils/media/helpers.js"));
const stream_1 = require("stream");
const index_js_1 = __importDefault(require("../media/index.js"));
const index_js_2 = __importDefault(require("../s3/index.js"));
const index_js_3 = __importDefault(require("../processed-images/index.js"));
const ProcessedImage_js_1 = __importDefault(require("../../db/models/ProcessedImage.js"));
const process_image_js_1 = __importDefault(require("../../workers/process-image.js"));
const saveAndRegister = async (client, data, image) => {
    try {
        await index_js_2.default.saveObject({
            type: "buffer",
            key: data.processKey,
            buffer: image.buffer,
            meta: {
                mimeType: image.mimeType,
                fileExtension: image.extension,
                size: image.size,
                width: image.width,
                height: image.height,
            },
        });
        await ProcessedImage_js_1.default.createSingle(client, {
            key: data.processKey,
            media_key: data.key,
        });
    }
    catch (err) {
    }
};
const processImage = async (client, data) => {
    const s3Response = await index_js_1.default.getS3Object({
        key: data.key,
    });
    if (!s3Response.contentType?.startsWith("image/")) {
        return {
            contentLength: s3Response.contentLength,
            contentType: s3Response.contentType,
            body: s3Response.body,
        };
    }
    try {
        await index_js_3.default.getSingleCount(client, {
            key: data.key,
        });
    }
    catch (err) {
        return {
            contentLength: s3Response.contentLength,
            contentType: s3Response.contentType,
            body: s3Response.body,
        };
    }
    const processRes = await (0, process_image_js_1.default)({
        buffer: await helpers_js_1.default.streamToBuffer(s3Response.body),
        options: data.options,
    });
    const stream = new stream_1.PassThrough();
    stream.end(Buffer.from(processRes.buffer));
    saveAndRegister(client, data, processRes);
    return {
        contentLength: processRes.size,
        contentType: processRes.mimeType,
        body: stream,
    };
};
exports.default = processImage;
//# sourceMappingURL=process-image.js.map