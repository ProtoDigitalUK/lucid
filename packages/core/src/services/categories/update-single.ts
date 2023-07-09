// Models
import Category from "@db/models/Category";

interface ServiceData {
  environment_key: string;
  id: string;
  data: {
    title?: string;
    slug?: string;
    description?: string;
  };
}

const updateSingle = async (data: ServiceData) => {
  const id = parseInt(data.id);

  const category = await Category.updateSingle(
    data.environment_key,
    id,
    data.data
  );

  return category;
};

export default updateSingle;
