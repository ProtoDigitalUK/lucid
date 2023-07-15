import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Services
import pageServices from "@services/pages";

export interface ServiceData {
  parent_id: number;
  environment_key: string;
  collection_key: string;
}

/*
    Checks:

    - If the parent exists
    - If the parent is the homepage (homepages cannot be parents and have children pages)
    - If the parent is in the same collection as the child
*/

const parentChecks = async (client: PoolClient, data: ServiceData) => {
  // Check if the parent exists and return it
  const parent = await service(
    pageServices.checkPageExists,
    false,
    client
  )({
    id: data.parent_id,
    environment_key: data.environment_key,
  });

  // Check if the parent is a homepage
  if (parent.homepage) {
    throw new LucidError({
      type: "basic",
      name: "Homepage Parent",
      message: "The homepage cannot be set as a parent!",
      status: 400,
    });
  }

  // Check if the parent is in the same collection as the child
  if (parent.collection_key !== data.collection_key) {
    throw new LucidError({
      type: "basic",
      name: "Parent Collection Mismatch",
      message:
        "The parent page must be in the same collection as the page you are creating!",
      status: 400,
    });
  }

  return parent;
};

export default parentChecks;
