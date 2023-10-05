import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Models
import SinglePage from "@db/models/SinglePage.js";
// Services
import environmentsService from "@services/environments/index.js";
import collectionsService from "@services/collections/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";
import singlePageService from "@services/single-pages/index.js";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  user_id: number;
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  // -------------------------------------------
  // Gets the single page, creates it if it doesn't exist
  const getSinglepage = await service(
    singlePageService.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
  });

  // -------------------------------------------
  // Update Single Page
  await SinglePage.updateSingle(client, {
    id: getSinglepage.id,
    user_id: data.user_id,
  });

  return undefined;
};

export default updateSingle;
