"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Config_js_1 = __importDefault(require("../Config.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const canStoreFiles = async (client, data) => {
    const { storageLimit, maxFileSize } = Config_js_1.default.media;
    for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        if (file.size > maxFileSize) {
            const message = `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`;
            throw new error_handler_js_1.LucidError({
                type: "basic",
                name: "Error saving file",
                message: message,
                status: 500,
                errors: (0, error_handler_js_1.modelErrors)({
                    file: {
                        code: "storage_limit",
                        message: message,
                    },
                }),
            });
        }
    }
    const storageUsed = await (0, service_js_1.default)(index_js_1.default.getStorageUsed, false, client)();
    const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize + (storageUsed || 0) > storageLimit) {
        const message = `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`;
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: message,
            status: 500,
            errors: (0, error_handler_js_1.modelErrors)({
                file: {
                    code: "storage_limit",
                    message: message,
                },
            }),
        });
    }
};
exports.default = canStoreFiles;
//# sourceMappingURL=can-store-files.js.map