import { PoolClient } from "pg";
// Models
import Category from "@db/models/Category.js";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";

export interface ServiceData {
  id: number;
  environment_key: string;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const category = await Category.deleteSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
  });

  if (!category) {
    throw new HeadlessError({
      type: "basic",
      name: "Category Not Deleted",
      message: "There was an error deleting the category.",
      status: 500,
    });
  }

  return undefined;
};

export default deleteSingle;
