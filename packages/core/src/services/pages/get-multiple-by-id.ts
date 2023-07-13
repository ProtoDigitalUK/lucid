// Models
import Page from "@db/models/Page";
// Format
import formatPage from "@utils/format/format-page";

export interface ServiceData {
  ids: Array<number>;
  environment_key: string;
}

const getMultipleById = async (data: ServiceData) => {
  const pages = await Page.getMultipleByIds({
    ids: data.ids,
    environment_key: data.environment_key,
  });

  return pages.map((page) => formatPage(page));
};

export default getMultipleById;
