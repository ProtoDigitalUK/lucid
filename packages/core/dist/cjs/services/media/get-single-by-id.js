"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Media_js_1 = __importDefault(require("../../db/models/Media.js"));
const format_media_js_1 = __importDefault(require("../../utils/format/format-media.js"));
const getSingleById = async (client, data) => {
    const media = await Media_js_1.default.getSingle(client, {
        key: data.key,
    });
    if (!media) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Media not found",
            message: "We couldn't find the media you were looking for.",
            status: 404,
        });
    }
    return (0, format_media_js_1.default)(media);
};
exports.default = getSingleById;
//# sourceMappingURL=get-single-by-id.js.map