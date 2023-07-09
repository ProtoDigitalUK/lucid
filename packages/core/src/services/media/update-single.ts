import fileUpload from "express-fileupload";
// Models
import Media from "@db/models/Media";

interface ServiceData {
  key: string;
  data: {
    name?: string;
    alt?: string;
    files: fileUpload.FileArray | null | undefined;
  };
}

const updateSingle = async (data: ServiceData) => {
  const media = await Media.updateSingle(data.key, data.data);

  return media;
};

export default updateSingle;
