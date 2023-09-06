import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Services
import pageServices from "@services/pages/index.js";
// Format
import formatPage from "@utils/format/format-page.js";

export interface ServiceData {
  id: number;
  environment_key: string;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  // -------------------------------------------
  // Checks
  await service(
    pageServices.checkPageExists,
    false,
    client
  )({
    id: data.id,
    environment_key: data.environment_key,
  });

  const page = await Page.deleteSingle(client, {
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
