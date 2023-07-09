// Models
import Category from "@db/models/Category";

interface ServiceData {
  id: string;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const id = parseInt(data.id);

  const category = await Category.deleteSingle(data.environment_key, id);

  return category;
};

export default deleteSingle;
