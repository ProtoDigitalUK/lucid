"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const mime_types_1 = __importDefault(require("mime-types"));
worker_threads_1.parentPort?.on("message", async (data) => {
    try {
        const transform = (0, sharp_1.default)(data.buffer);
        if (data.options.format) {
            transform.toFormat(data.options.format, {
                quality: data.options.quality ? parseInt(data.options.quality) : 80,
            });
        }
        if (data.options.width || data.options.height) {
            transform.resize({
                width: data.options.width ? parseInt(data.options.width) : undefined,
                height: data.options.height ? parseInt(data.options.height) : undefined,
            });
        }
        const outputBuffer = await transform.toBuffer();
        const meta = await (0, sharp_1.default)(outputBuffer).metadata();
        const mimeType = mime_types_1.default.lookup(data.options.format || "jpg") || "image/jpeg";
        const response = {
            success: true,
            data: {
                buffer: outputBuffer,
                mimeType: mimeType,
                size: outputBuffer.length,
                width: meta.width || null,
                height: meta.height || null,
                extension: mime_types_1.default.extension(mimeType) || "",
            },
        };
        worker_threads_1.parentPort?.postMessage(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error.message,
        };
        worker_threads_1.parentPort?.postMessage(response);
    }
});
const useProcessImage = async (data) => {
    const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, "process-image.ts"));
    return new Promise((resolve, reject) => {
        worker.on("message", (message) => {
            if (message.success) {
                resolve(message.data);
            }
            else {
                reject(new Error(message.error));
            }
        });
        worker.postMessage(data);
    });
};
exports.default = useProcessImage;
//# sourceMappingURL=process-image.js.map