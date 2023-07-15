import { PoolClient } from "pg";
// Models
import Category from "@db/models/Category";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";

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
      }),
    });
  }

  return category;
};

export default getSingle;
