// Types
import type { CategoryT } from "@db/models/Category.js";
import type { CollectionCategoriesResT } from "@headless/types/src/collections.js";

const formatCategory = (category: CategoryT): CollectionCategoriesResT => {
  return category;
};

export default formatCategory;
