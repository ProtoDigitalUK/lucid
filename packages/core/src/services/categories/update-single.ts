// Models
import Category from "@db/models/Category";
import categories from "@services/categories";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";

export interface ServiceData {
  environment_key: string;
  id: number;
  data: {
    title?: string;
    slug?: string;
    description?: string;
  };
}

const updateSingle = async (data: ServiceData) => {
  // Check if category exists
  const currentCategory = await categories.getSingle({
    environment_key: data.environment_key,
    id: data.id,
  });

  if (data.data.slug) {
    const isSlugUnique = await Category.isSlugUniqueInCollection({
      collection_key: currentCategory.collection_key,
      slug: data.data.slug,
      environment_key: data.environment_key,
      ignore_id: data.id,
    });
    if (!isSlugUnique) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Updated",
        message: "Please provide a unique slug within this post type.",
        status: 400,
        errors: modelErrors({
          slug: {
            code: "not_unique",
            message: "Please provide a unique slug within this post type.",
          },
        }),
      });
    }
  }

  return await Category.updateSingle(data.environment_key, data.id, data.data);
};

export default updateSingle;
