import { PoolClient } from "pg";
// Models
import Category from "@db/models/Category.js";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import collectionsService from "@services/collections/index.js";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description?: string;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  // Perform checks  - doesnt need client
  await service(
    collectionsService.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    type: "pages",
    environment_key: data.environment_key,
  });

  // check if slug is unique in post type
  const isSlugUnique = await Category.isSlugUniqueInCollection(client, {
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
  const category = await Category.createSingle(client, data);

  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Created",
      message: "There was an error creating the category.",
      status: 500,
    });
  }

  return undefined;
};

export default createSingle;
