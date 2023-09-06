import createURL from "../media/create-url.js";
const formatMedia = (media) => {
    return {
        id: media.id,
        key: media.key,
        url: createURL(media.key),
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
export default formatMedia;
//# sourceMappingURL=format-media.js.map