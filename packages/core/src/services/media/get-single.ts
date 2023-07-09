// Models
import Media from "@db/models/Media";

export interface ServiceData {
  key: string;
}

const getSingle = async (data: ServiceData) => {
  const media = await Media.getSingle(data.key);
  return media;
};

export default getSingle;
