import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import PageCategory from "@db/models/PageCategory.js";
// Srvices
import pageCategoryService from "@services/page-categories/index.js";

export interface ServiceData {
  page_id: number;
  category_ids: Array<number>;
  collection_key: string;
}

const createMultiple = async (client: PoolClient, data: ServiceData) => {
  await service(
    pageCategoryService.verifyCategoriesInCollection,
    false,
    client
  )({
    category_ids: data.category_ids,
    collection_key: data.collection_key,
  });

  const pageCategory = await PageCategory.createMultiple(client, {
    page_id: data.page_id,
    category_ids: data.category_ids,
  });

  if (pageCategory.length !== data.category_ids.length) {
    throw new HeadlessError({
      type: "basic",
      name: "Page Category Not Created",
      message: "There was an error creating the page category.",
      status: 500,
    });
  }

  return pageCategory;
};

export default createMultiple;
