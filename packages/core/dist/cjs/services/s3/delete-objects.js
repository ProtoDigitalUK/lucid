"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_js_1 = __importDefault(require("../../utils/app/s3-client.js"));
const Config_js_1 = __importDefault(require("../Config.js"));
const deleteObjects = async (data) => {
    const S3 = await s3_client_js_1.default;
    const command = new client_s3_1.DeleteObjectsCommand({
        Bucket: Config_js_1.default.media.store.bucket,
        Delete: {
            Objects: data.objects.map((object) => ({
                Key: object.key,
            })),
        },
    });
    return S3.send(command);
};
exports.default = deleteObjects;
//# sourceMappingURL=delete-objects.js.map