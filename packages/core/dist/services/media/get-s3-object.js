"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_1 = __importDefault(require("../../utils/app/s3-client"));
const Config_1 = __importDefault(require("../Config"));
const getS3Object = async (data) => {
    const S3 = await s3_client_1.default;
    const command = new client_s3_1.GetObjectCommand({
        Bucket: Config_1.default.media.store.bucket,
        Key: data.key,
    });
    const res = await S3.send(command);
    if (res.Body === undefined)
        throw new Error("S3 object body is undefined");
    return {
        contentLength: res.ContentLength,
        contentType: res.ContentType,
        body: res.Body,
    };
};
exports.default = getS3Object;
//# sourceMappingURL=get-s3-object.js.map