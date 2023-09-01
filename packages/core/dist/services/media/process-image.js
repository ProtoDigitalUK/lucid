"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_client_1 = __importDefault(require("../../utils/app/s3-client"));
const stream_1 = require("stream");
const media_1 = __importDefault(require("../media"));
const processImage = async (client, data) => {
    const S3 = await s3_client_1.default;
    const key = `processed/${data.key}`;
    if (data.query.format)
        key.concat(`.${data.query.format}`);
    if (data.query.width)
        key.concat(`.${data.query.width}`);
    if (data.query.height)
        key.concat(`.${data.query.height}`);
    try {
        return media_1.default.getS3Object({
            key: key,
        });
    }
    catch (err) {
        return {
            contentLength: 0,
            contentType: "",
            body: new stream_1.Readable(),
        };
    }
};
exports.default = processImage;
//# sourceMappingURL=process-image.js.map