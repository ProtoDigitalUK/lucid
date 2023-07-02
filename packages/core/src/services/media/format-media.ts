import { MediaT } from "@db/models/Media";

export interface MediaResT {
  id: number;
  key: string;
  url: string;
  name: string;
  alt: string | null;
  meta: {
    mime_type: string;
    file_extension: string;
    file_size: number;
    width: number | null;
    height: number | null;
  };
  created_at: string;
  updated_at: string;
}

const formatMedia = (media: MediaT, location: string): MediaResT => {
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

export default formatMedia;
