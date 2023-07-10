"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Config_1 = __importDefault(require("../../db/models/Config"));
const media_1 = __importDefault(require("../media"));
const canStoreFiles = async (data) => {
    const { storageLimit, maxFileSize } = Config_1.default.media;
    for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        if (file.size > maxFileSize) {
            const message = `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`;
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Error saving file",
                message: message,
                status: 500,
                errors: (0, error_handler_1.modelErrors)({
                    file: {
                        code: "storage_limit",
                        message: message,
                    },
                }),
            });
        }
    }
    const storageUsed = await media_1.default.getStorageUsed();
    const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize + storageUsed > storageLimit) {
        const message = `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`;
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: message,
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
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