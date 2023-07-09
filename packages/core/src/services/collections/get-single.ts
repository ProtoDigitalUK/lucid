// Models
import Collection from "@db/models/Collection";

interface ServiceData {
  collection_key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  const collections = await Collection.getSingle({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
  });
  return collections;
};

export default getSingle;
