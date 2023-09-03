"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_url_1 = __importDefault(require("../media/create-url"));
const formatMedia = (media) => {
    return {
        id: media.id,
        key: media.key,
        url: (0, create_url_1.default)(media.key),
        name: media.name,
        alt: media.alt,
        type: media.type,
        meta: {
            mime_type: media.mime_type,
            file_extension: media.file_extension,
            file_size: media.file_size,
            width: media.width,
            height: media.height,
        },
        created_at: media.created_at,
        updated_at: media.updated_at,
    };
};
exports.default = formatMedia;
//# sourceMappingURL=format-media.js.map