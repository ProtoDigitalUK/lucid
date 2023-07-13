// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Page from "@db/models/Page";

export interface ServiceData {
  id: number;
  environment_key: string;
}

const checkPageExists = async (data: ServiceData) => {
  const page = await Page.getSingleBasic(data.id, data.environment_key);

  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page not found",
      message: `Page with id "${data.id}" not found in environment "${data.environment_key}"!`,
      status: 404,
    });
  }

  return page;
};

export default checkPageExists;
