// Models
import Media from "@db/models/Media";

export interface ServiceData {
  key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const media = await Media.deleteSingle(data.key);

  return media;
};

export default deleteSingle;
