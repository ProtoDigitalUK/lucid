// Models
import Page from "@db/models/Page";

export interface ServiceData {
  id: number;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const page = await Page.deleteSingle({
    id: data.id,
    environment_key: data.environment_key,
  });

  return page;
};

export default deleteSingle;
