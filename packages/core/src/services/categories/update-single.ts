// Models
import Category from "@db/models/Category";

interface ServiceData {
  environment_key: string;
  id: number;
  data: {
    title?: string;
    slug?: string;
    description?: string;
  };
}

const updateSingle = async (data: ServiceData) => {
  const category = await Category.updateSingle(
    data.environment_key,
    data.id,
    data.data
  );

  return category;
};

export default updateSingle;
