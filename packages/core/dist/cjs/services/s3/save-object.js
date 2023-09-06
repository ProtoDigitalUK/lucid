"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_js_1 = __importDefault(require("../../utils/app/s3-client.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const saveObject = async (data) => {
    const S3 = await s3_client_js_1.default;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: Config_js_1.default.media.store.bucket,
        Key: data.key,
        Body: data.type === "file" ? data.file?.data : data.buffer,
        ContentType: data.meta.mimeType,
        Metadata: {
            width: data.meta.width?.toString() || "",
            height: data.meta.height?.toString() || "",
            extension: data.meta.fileExtension,
        },
    });
    return S3.send(command);
};
exports.default = saveObject;
//# sourceMappingURL=save-object.js.map