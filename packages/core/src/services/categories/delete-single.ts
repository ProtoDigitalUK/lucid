// Models
import Category from "@db/models/Category";
// Utils
import { LucidError } from "@utils/app/error-handler";

export interface ServiceData {
  id: number;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const category = await Category.deleteSingle(data.environment_key, data.id);

  if (!category) {
    throw new LucidError({
      type: "basic",
      name: "Category Not Deleted",
      message: "There was an error deleting the category.",
      status: 500,
    });
  }

  return category;
};

export default deleteSingle;
