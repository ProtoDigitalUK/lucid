"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_js_1 = __importDefault(require("../../utils/media/helpers.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Media_js_1 = __importDefault(require("../../db/models/Media.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const index_js_2 = __importDefault(require("../s3/index.js"));
const format_media_js_1 = __importDefault(require("../../utils/format/format-media.js"));
const createSingle = async (client, data) => {
    if (!data.files || !data.files["file"]) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "No files provided",
            message: "No files provided",
            status: 400,
            errors: (0, error_handler_js_1.modelErrors)({
                file: {
                    code: "required",
                    message: "No files provided",
                },
            }),
        });
    }
    const files = helpers_js_1.default.formatReqFiles(data.files);
    const firstFile = files[0];
    await (0, service_js_1.default)(index_js_1.default.canStoreFiles, false, client)({
        files,
    });
    const key = helpers_js_1.default.uniqueKey(data.name || firstFile.name);
    const meta = await helpers_js_1.default.getMetaData(firstFile);
    const type = helpers_js_1.default.getMediaType(meta.mimeType);
    const response = await index_js_2.default.saveObject({
        type: "file",
        key: key,
        file: firstFile,
        meta,
    });
    if (response.$metadata.httpStatusCode !== 200) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: (0, error_handler_js_1.modelErrors)({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    const media = await Media_js_1.default.createSingle(client, {
        key: key,
        name: data.name || firstFile.name,
        alt: data.alt,
        etag: response.ETag?.replace(/"/g, ""),
        type: type,
        meta: meta,
    });
    if (!media) {
        await index_js_2.default.deleteObject({
            key,
        });
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: (0, error_handler_js_1.modelErrors)({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    await (0, service_js_1.default)(index_js_1.default.setStorageUsed, false, client)({
        add: meta.size,
    });
    return (0, format_media_js_1.default)(media);
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map