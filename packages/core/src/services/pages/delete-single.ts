import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Page from "@db/models/Page.js";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const page = await Page.deleteSingle(client, {
    id: data.id,
  });

  if (!page) {
    throw new HeadlessError({
      type: "basic",
      name: "Page Not Deleted",
      message: "There was an error deleting the page",
      status: 500,
    });
  }

  return undefined;
};

export default deleteSingle;
