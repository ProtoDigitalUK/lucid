import { MediaT } from "@db/models/Media.js";
// Utils
import createURL from "@utils/media/create-url.js";
// Types
import { MediaResT } from "@lucid/types/src/media.js";

const formatMedia = (media: MediaT): MediaResT => {
  return {
    id: media.id,
    key: media.key,
    url: createURL(media.key) as string,
    name_translation_key_id: media.name_translation_key_id,
    alt_translation_key_id: media.alt_translation_key_id,
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
