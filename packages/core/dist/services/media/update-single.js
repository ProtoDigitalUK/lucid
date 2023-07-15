"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/media/helpers"));
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../media"));
const s3_1 = __importDefault(require("../s3"));
const updateSingle = async (client, data) => {
    const media = await (0, service_1.default)(media_1.default.getSingle, false, client)({
        key: data.key,
    });
    let meta = undefined;
    if (data.data.files && data.data.files["file"]) {
        const files = helpers_1.default.formatReqFiles(data.data.files);
        const firstFile = files[0];
        await (0, service_1.default)(media_1.default.canStoreFiles, false, client)({
            files,
        });
        meta = await helpers_1.default.getMetaData(firstFile);
        const response = await s3_1.default.saveFile({
            key: media.key,
            file: firstFile,
            meta,
        });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Error updating file",
                message: "There was an error updating the file.",
                status: 500,
                errors: (0, error_handler_1.modelErrors)({
                    file: {
                        code: "required",
                        message: "There was an error updating the file.",
                    },
                }),
            });
        }
        await (0, service_1.default)(media_1.default.setStorageUsed, false, client)({
            add: meta.size,
            minus: media.meta.file_size,
        });
    }
    const mediaUpdate = await Media_1.default.updateSingle(client, {
        key: data.key,
        name: data.data.name,
        alt: data.data.alt,
        meta: meta,
    });
    if (!mediaUpdate) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error updating media",
            message: "There was an error updating the media.",
            status: 500,
        });
    }
    return await (0, service_1.default)(media_1.default.getSingle, false, client)({
        key: mediaUpdate.key,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map