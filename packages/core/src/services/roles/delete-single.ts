// Models
import Role from "@db/models/Role";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (data: ServiceData) => {
  const role = await Role.deleteSingle(data.id);
  return role;
};

export default deleteSingle;
