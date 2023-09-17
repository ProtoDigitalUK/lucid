import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Models
import Page from "@db/models/Page.js";

export interface ServiceData {
  page_id: number;
  parent_id: number;
}

const checkParentAncestry = async (client: PoolClient, data: ServiceData) => {
  const results = await Page.checkParentAncestry(client, data);

  if (results.length > 0) {
    throw new LucidError({
      type: "basic",
      name: "Page Not Updated",
      message: "An error occurred while updating the page.",
      status: 400,
      errors: modelErrors({
        parent_id: {
          code: "invalid",
          message:
            "The page you are trying to set as the parent is currently a child of this page.",
        },
      }),
    });
  }

  return;
};

export default checkParentAncestry;
