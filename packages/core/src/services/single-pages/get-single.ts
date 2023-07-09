// Models
import SinglePage from "@db/models/SinglePage";

interface ServiceData {
  environment_key: string;
  collection_key: string;
}

const getSingle = async (data: ServiceData) => {
  const singlepage = await SinglePage.getSingle({
    environment_key: data.environment_key,
    collection_key: data.collection_key,
  });

  return singlepage;
};

export default getSingle;
