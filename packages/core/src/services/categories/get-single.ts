import { PoolClient } from "pg";
// Models
import Category from "@db/models/Category.js";
// Utils
import { HeadlessError, modelErrors } from "@utils/app/error-handler.js";
// Format
import formatCategory from "@utils/format/format-category.js";

export interface ServiceData {
  environment_key: string;
  id: number;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const category = await Category.getSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
  });

  if (!category) {
    throw new HeadlessError({
      type: "basic",
      name: "Category Not Found",
      message: "Category not found.",
      status: 404,
      errors: modelErrors({
        id: {
          code: "not_found",
          message: "Category not found.",
        },
      }),
    });
  }

  return formatCategory(category);
};

export default getSingle;
