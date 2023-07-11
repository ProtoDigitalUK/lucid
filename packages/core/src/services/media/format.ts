import { MediaT } from "@db/models/Media";
// Utils
import createURL from "@utils/media/create-url";
// Services
import { MediaResT } from "@services/media";

const formatMedia = (media: MediaT): MediaResT => {
  return {
    id: media.id,
    key: media.key,
    url: createURL(media.key) as string,
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

export default formatMedia;