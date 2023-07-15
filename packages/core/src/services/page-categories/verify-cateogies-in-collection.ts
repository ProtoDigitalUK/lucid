// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import PageCategory from "@db/models/PageCategory";

export interface ServiceData {
  category_ids: Array<number>;
  collection_key: string;
}

/*
  Verifies that all given categories exist in a specific collection.
  If any of the categories do not exist, an error is thrown.
*/

const verifyCategoriesInCollection = async (data: ServiceData) => {
  const pageCategories = await PageCategory.getMultiple({
    category_ids: data.category_ids,
    collection_key: data.collection_key,
  });

  if (pageCategories.length !== data.category_ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Found",
      message: "Category not found.",
      status: 404,
      errors: modelErrors({
        id: {
          code: "not_found",
          message: "Category not found.",
        },
        collection_key: {
          code: "not_found",
          message: "Collection key not found.",
        },
      }),
    });
  }

  return pageCategories;
};

export default verifyCategoriesInCollection;
