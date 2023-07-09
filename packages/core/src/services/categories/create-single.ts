// Models
import Category from "@db/models/Category";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description?: string;
}

const createSingle = async (data: ServiceData) => {
  const category = await Category.createSingle({
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    title: data.title,
    slug: data.slug,
    description: data.description,
  });

  return category;
};

export default createSingle;
