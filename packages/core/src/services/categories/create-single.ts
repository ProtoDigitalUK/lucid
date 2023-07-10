// Models
import Category from "@db/models/Category";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Services
import collections from "@services/collections";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description?: string;
}

const createSingle = async (data: ServiceData) => {
  // Perform checks
  await collections.getSingle({
    collection_key: data.collection_key,
    type: "pages",
    environment_key: data.environment_key,
  });

  // check if slug is unique in post type
  const isSlugUnique = await Category.isSlugUniqueInCollection({
    collection_key: data.collection_key,
    slug: data.slug,
    environment_key: data.environment_key,
  });

  if (!isSlugUnique) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Created",
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

  // Create the category using the model
  const category = await Category.createSingle(data);

  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Created",
      message: "There was an error creating the category.",
      status: 500,
    });
  }

  return category;
};

export default createSingle;
