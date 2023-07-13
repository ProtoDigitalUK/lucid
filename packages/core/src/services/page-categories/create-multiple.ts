// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import PageCategory from "@db/models/PageCategory";
// Srvices
import pageCategoryService from "@services/page-categories";

export interface ServiceData {
  page_id: number;
  category_ids: Array<number>;
  collection_key: string;
}

const createMultiple = async (data: ServiceData) => {
  await pageCategoryService.verifyCategoriesInCollection({
    category_ids: data.category_ids,
    collection_key: data.collection_key,
  });

  const pageCategory = await PageCategory.createMultiple({
    page_id: data.page_id,
    category_ids: data.category_ids,
  });

  if (pageCategory.length !== data.category_ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Page Category Not Created",
      message: "There was an error creating the page category.",
      status: 500,
    });
  }

  return pageCategory;
};

export default createMultiple;
