"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_js_1 = __importDefault(require("../../utils/app/s3-client.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const deleteObject = async (data) => {
    const S3 = await s3_client_js_1.default;
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: Config_js_1.default.media.store.bucket,
        Key: data.key,
    });
    return S3.send(command);
};
exports.default = deleteObject;
//# sourceMappingURL=delete-object.js.map