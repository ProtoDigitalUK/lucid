"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/media/helpers"));
const stream_1 = require("stream");
const media_1 = __importDefault(require("../media"));
const s3_1 = __importDefault(require("../s3"));
const ProcessedImage_1 = __importDefault(require("../../db/models/ProcessedImage"));
const process_image_1 = __importDefault(require("../../workers/process-image"));
const saveAndRegister = async (client, data, image) => {
    try {
        await s3_1.default.saveObject({
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
        await ProcessedImage_1.default.createSingle(client, {
            key: data.processKey,
            media_key: data.key,
        });
    }
    catch (err) {
    }
};
const processImage = async (client, data) => {
    const s3Response = await media_1.default.getS3Object({
        key: data.key,
    });
    const processRes = await (0, process_image_1.default)({
        buffer: await helpers_1.default.streamToBuffer(s3Response.body),
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