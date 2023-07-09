// Models
import Category from "@db/models/Category";

interface ServiceData {
  id: number;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const category = await Category.deleteSingle(data.environment_key, data.id);

  return category;
};

export default deleteSingle;
