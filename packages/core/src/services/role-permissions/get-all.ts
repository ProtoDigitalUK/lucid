// Models
import RolePermission from "@db/models/RolePermission";

export interface ServiceData {
  role_id: number;
}

const getAll = async (data: ServiceData) => {
  const rolePermissions = await RolePermission.getAll({
    role_id: data.role_id,
  });

  return rolePermissions;
};

export default getAll;
