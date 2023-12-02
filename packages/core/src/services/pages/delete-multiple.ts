import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Page from "@db/models/Page.js";

export interface ServiceData {
  ids: number[];
}

const deleteMultiple = async (client: PoolClient, data: ServiceData) => {
  const page = await Page.deleteMultiple(client, {
    ids: data.ids,
  });

  if (page.length !== data.ids.length) {
    throw new HeadlessError({
      type: "basic",
      name: "Pages Not Deleted",
      message: "There was an error deleting some or all of the pages",
      status: 500,
    });
  }

  return undefined;
};

export default deleteMultiple;
