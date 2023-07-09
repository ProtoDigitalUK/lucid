// Models
import Category from "@db/models/Category";

interface ServiceData {
  environment_key: string;
  id: string;
}

const getSingle = async (data: ServiceData) => {
  const id = parseInt(data.id);

  const category = await Category.getSingle(data.environment_key, id);

  return category;
};

export default getSingle;
