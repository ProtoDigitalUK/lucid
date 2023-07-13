// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Page from "@db/models/Page";
// Services
import pageServices from "@services/pages";
// Format
import formatPage from "@utils/format/format-page";

export interface ServiceData {
  id: number;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  // -------------------------------------------
  // Checks
  await pageServices.checkPageExists({
    id: data.id,
    environment_key: data.environment_key,
  });

  const page = await Page.deleteSingle({
    id: data.id,
  });

  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Deleted",
      message: "There was an error deleting the page",
      status: 500,
    });
  }

  return formatPage(page);
};

export default deleteSingle;
