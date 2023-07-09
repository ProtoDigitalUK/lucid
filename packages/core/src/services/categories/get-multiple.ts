import z from "zod";
// Models
import Category from "@db/models/Category";
// Schema
import categorySchema from "@schemas/categories";

export interface ServiceData {
  environment_key: string;
  query: z.infer<typeof categorySchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
  const categories = await Category.getMultiple(
    data.environment_key,
    data.query
  );

  return categories;
};

export default getMultiple;
