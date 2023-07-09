// Models
import Category from "@db/models/Category";

interface ServiceData {
  environment_key: string;
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const category = await Category.getSingle(data.environment_key, data.id);

  return category;
};

export default getSingle;
