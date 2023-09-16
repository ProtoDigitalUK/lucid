import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Models
import Category from "@db/models/Category.js";
import categoriesService from "@services/categories/index.js";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";

export interface ServiceData {
  environment_key: string;
  id: number;
  data: {
    title?: string;
    slug?: string;
    description?: string;
  };
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  // Check if category exists
  const currentCategory = await service(
    categoriesService.getSingle,
    false,
    client
  )({
    environment_key: data.environment_key,
    id: data.id,
  });

  if (data.data.slug) {
    const isSlugUnique = await Category.isSlugUniqueInCollection(client, {
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

  const category = await Category.updateSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
    title: data.data.title,
    slug: data.data.slug,
    description: data.data.description,
  });

  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Updated",
      message: "There was an error updating the category.",
      status: 500,
    });
  }

  return undefined;
};

export default updateSingle;
