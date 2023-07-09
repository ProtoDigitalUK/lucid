// Models
import Category from "@db/models/Category";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";

export interface ServiceData {
  environment_key: string;
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const category = await Category.getSingle(data.environment_key, data.id);

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
