// Models
import RolePermission from "@db/models/RolePermission";

export interface ServiceData {
  role_id: number;
}

const deleteAll = async (data: ServiceData) => {
  const permissions = await RolePermission.deleteAll(data.role_id);

  return permissions;
};

export default deleteAll;
