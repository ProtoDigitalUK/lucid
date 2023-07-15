import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Models
import PageCategory from "@db/models/PageCategory";
// Srvices
import pageCategoryService from "@services/page-categories";

export interface ServiceData {
  page_id: number;
  category_ids: Array<number>; // all categories to be associated with the page
  collection_key: string;
}

const updateMultiple = async (client: PoolClient, data: ServiceData) => {
  // get all page_categories for the page
  const pageCategoriesRes = await PageCategory.getMultipleByPageId(client, {
    page_id: data.page_id,
  });

  // Categories to add
  const categoriesToAdd = data.category_ids.filter(
    (id) =>
      !pageCategoriesRes.find((pageCategory) => pageCategory.category_id === id)
  );

  // Categories to remove
  const categoriesToRemove = pageCategoriesRes.filter(
    (pageCategory) => !data.category_ids.includes(pageCategory.category_id)
  );

  // Add categories
  const updatePromise = [];
  if (categoriesToAdd.length > 0) {
    updatePromise.push(
      service(
        pageCategoryService.createMultiple,
        false,
        client
      )({
        page_id: data.page_id,
        category_ids: categoriesToAdd,
        collection_key: data.collection_key,
      })
    );
  }
  if (categoriesToRemove.length > 0) {
    updatePromise.push(
      service(
        pageCategoryService.deleteMultiple,
        false,
        client
      )({
        page_id: data.page_id,
        category_ids: categoriesToRemove.map(
          (category) => category.category_id
        ),
      })
    );
  }

  const updateRes = await Promise.all(updatePromise);

  const newPageCategories = pageCategoriesRes.filter(
    (pageCategory) => !categoriesToRemove.includes(pageCategory)
  );

  if (categoriesToAdd.length > 0) {
    newPageCategories.push(...updateRes[0]);
  }

  return newPageCategories;
};

export default updateMultiple;
