// Types
import type { CategoryT } from "@db/models/Category.js";
import type { CollectionCategoriesResT } from "@lucid/types/src/collections.js";

const formatCategory = (category: CategoryT): CollectionCategoriesResT => {
  return category;
};

export default formatCategory;
