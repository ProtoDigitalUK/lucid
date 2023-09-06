"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_js_1 = __importDefault(require("../../utils/media/helpers.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Media_js_1 = __importDefault(require("../../db/models/Media.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const index_js_2 = __importDefault(require("../s3/index.js"));
const index_js_3 = __importDefault(require("../processed-images/index.js"));
const updateSingle = async (client, data) => {
    const media = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        id: data.id,
    });
    let meta = undefined;
    let newKey = undefined;
    let newType = undefined;
    if (data.data.files && data.data.files["file"]) {
        const files = helpers_js_1.default.formatReqFiles(data.data.files);
        const firstFile = files[0];
        await (0, service_js_1.default)(index_js_1.default.canStoreFiles, false, client)({
            files,
        });
        meta = await helpers_js_1.default.getMetaData(firstFile);
        newKey = helpers_js_1.default.uniqueKey(data.data.name || firstFile.name);
        newType = helpers_js_1.default.getMediaType(meta.mimeType);
        const updateKeyRes = await index_js_2.default.updateObjectKey({
            oldKey: media.key,
            newKey: newKey,
        });
        if (updateKeyRes.$metadata.httpStatusCode !== 200) {
            throw new error_handler_js_1.LucidError({
                type: "basic",
                name: "Error updating file",
                message: "There was an error updating the file.",
                status: 500,
                errors: (0, error_handler_js_1.modelErrors)({
                    file: {
                        code: "required",
                        message: "There was an error updating the file.",
                    },
                }),
            });
        }
        const response = await index_js_2.default.saveObject({
            type: "file",
            key: newKey,
            file: firstFile,
            meta,
        });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new error_handler_js_1.LucidError({
                type: "basic",
                name: "Error updating file",
                message: "There was an error updating the file.",
                status: 500,
                errors: (0, error_handler_js_1.modelErrors)({
                    file: {
                        code: "required",
                        message: "There was an error updating the file.",
                    },
                }),
            });
        }
        await (0, service_js_1.default)(index_js_1.default.setStorageUsed, false, client)({
            add: meta.size,
            minus: media.meta.file_size,
        });
        await (0, service_js_1.default)(index_js_3.default.clearSingle, false, client)({
            id: media.id,
        });
    }
    const mediaUpdate = await Media_js_1.default.updateSingle(client, {
        key: media.key,
        name: data.data.name,
        alt: data.data.alt,
        meta: meta,
        type: newType,
        newKey: newKey,
    });
    if (!mediaUpdate) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error updating media",
            message: "There was an error updating the media.",
            status: 500,
        });
    }
    return undefined;
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map