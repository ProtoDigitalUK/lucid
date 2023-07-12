"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const Config_1 = __importDefault(require("../../services/Config"));
const getS3Client = async () => {
    const config = await Config_1.default.getConfig();
    const s3Config = {
        region: config.media.store.region,
        credentials: {
            accessKeyId: config.media.store.accessKeyId,
            secretAccessKey: config.media.store.secretAccessKey,
        },
    };
    if (config.media.store.service === "cloudflare") {
        s3Config.endpoint = `https://${config.media.store.cloudflareAccountId}.r2.cloudflarestorage.com`;
    }
    return new client_s3_1.S3Client(s3Config);
};
exports.default = getS3Client();
//# sourceMappingURL=s3-client.js.map