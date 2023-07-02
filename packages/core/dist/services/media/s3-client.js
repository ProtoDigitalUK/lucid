"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const Config_1 = __importDefault(require("../../db/models/Config"));
const storeConfig = Config_1.default.media.store;
const S3 = new client_s3_1.S3Client({
    region: storeConfig.region,
    endpoint: storeConfig.service === "cloudflare"
        ? `https://${storeConfig.cloudflareAccountId}.r2.cloudflarestorage.com`
        : undefined,
    credentials: {
        accessKeyId: storeConfig.accessKeyId,
        secretAccessKey: storeConfig.secretAccessKey,
    },
});
exports.default = S3;
//# sourceMappingURL=s3-client.js.map