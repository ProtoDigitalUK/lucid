"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_client_1 = __importDefault(require("../../utils/media/s3-client"));
const client_s3_1 = require("@aws-sdk/client-s3");
const Config_1 = __importDefault(require("../../db/models/Config"));
const streamMedia = async (data) => {
    const S3 = await s3_client_1.default;
    const command = new client_s3_1.GetObjectCommand({
        Bucket: Config_1.default.media.store.bucket,
        Key: data.key,
    });
    return S3.send(command);
};
exports.default = streamMedia;
//# sourceMappingURL=stream-media.js.map