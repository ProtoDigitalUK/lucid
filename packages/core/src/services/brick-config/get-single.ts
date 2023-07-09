// Models
import BrickConfig from "@db/models/BrickConfig";

interface ServiceData {
  brick_key: string;
  collection_key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  const brick = await BrickConfig.getSingle({
    brick_key: data.brick_key,
    collection_key: data.collection_key,
    environment_key: data.environment_key,
  });

  return brick;
};

export default getSingle;
