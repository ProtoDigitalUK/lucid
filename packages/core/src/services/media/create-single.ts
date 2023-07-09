import fileUpload from "express-fileupload";
// Models
import Media from "@db/models/Media";

interface ServiceData {
  name?: string;
  alt?: string;
  files?: fileUpload.FileArray | null | undefined;
}

const createSingle = async (data: ServiceData) => {
  const media = await Media.createSingle({
    name: data.name,
    alt: data.alt,
    files: data.files,
  });

  return media;
};

export default createSingle;
