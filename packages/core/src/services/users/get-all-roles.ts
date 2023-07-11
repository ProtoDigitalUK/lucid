// Models
import UserRole from "@db/models/UserRole";

export interface ServiceData {
  user_id: number;
}

const getAllRoles = async (data: ServiceData) => {
  const userRoles = await UserRole.getAll(data.user_id);
  return userRoles;
};

export default getAllRoles;
