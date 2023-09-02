"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_1 = __importDefault(require("../../utils/app/s3-client"));
const Config_1 = __importDefault(require("../Config"));
const updateObjectKey = async (data) => {
    const S3 = await s3_client_1.default;
    const copyCommand = new client_s3_1.CopyObjectCommand({
        Bucket: Config_1.default.media.store.bucket,
        CopySource: `${Config_1.default.media.store.bucket}/${data.oldKey}`,
        Key: data.newKey,
    });
    const res = await S3.send(copyCommand);
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: Config_1.default.media.store.bucket,
        Key: data.oldKey,
    });
    await S3.send(command);
    return res;
};
exports.default = updateObjectKey;
//# sourceMappingURL=update-object-key.js.map