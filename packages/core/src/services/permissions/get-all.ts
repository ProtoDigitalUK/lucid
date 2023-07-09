// Models
import RolePermission from "@db/models/RolePermission";

interface ServiceData {}

const getAll = async (data: ServiceData) => {
  return RolePermission.getValidPermissions;
};

export default getAll;
