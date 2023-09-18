import { PoolClient } from "pg";
// Models
import Page from "@db/models/Page.js";

export interface ServiceData {
  page_id: number;
  environment_key: string;
  collection_key: string;
}

const getAllValidParents = async (client: PoolClient, data: ServiceData) => {
  const results = await Page.getValidParents(client, {
    page_id: data.page_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
  });

  return results;
};

export default getAllValidParents;
