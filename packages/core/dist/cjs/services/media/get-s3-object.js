"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_js_1 = __importDefault(require("../../utils/app/s3-client.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Config_js_1 = __importDefault(require("../Config.js"));
const getS3Object = async (data) => {
    try {
        const S3 = await s3_client_js_1.default;
        const command = new client_s3_1.GetObjectCommand({
            Bucket: Config_js_1.default.media.store.bucket,
            Key: data.key,
        });
        const res = await S3.send(command);
        return {
            contentLength: res.ContentLength,
            contentType: res.ContentType,
            body: res.Body,
        };
    }
    catch (err) {
        const error = err;
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: error.name || "Error",
            message: error.message || "An error occurred",
            status: error.message === "The specified key does not exist." ? 404 : 500,
        });
    }
};
exports.default = getS3Object;
//# sourceMappingURL=get-s3-object.js.map