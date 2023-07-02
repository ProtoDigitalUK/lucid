"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatMedia = (media, location) => {
    return {
        id: media.id,
        key: media.key,
        url: `${location}/cdn/${media.key}`,
        name: media.name,
        alt: media.alt,
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