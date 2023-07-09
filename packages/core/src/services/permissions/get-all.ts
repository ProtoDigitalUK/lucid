// Models
import RolePermission from "@db/models/RolePermission";

export interface ServiceData {}

export const getAll = async (data: ServiceData) => {
  return RolePermission.getValidPermissions;
};

export default getAll;
