// Models
import UserRole from "@db/models/UserRole";

interface ServiceData {
  user_id: number;
  role_ids: number[];
}

const updateRoles = async (data: ServiceData) => {
  const userRoles = await UserRole.update(data.user_id, {
    role_ids: data.role_ids,
  });
  return userRoles;
};

export default updateRoles;
