import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
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
    throw new LucidError({
      type: "basic",
      name: "Page Not Deleted",
      message: "There was an error deleting the page",
      status: 500,
    });
  }

  return undefined;
};

export default deleteSingle;
