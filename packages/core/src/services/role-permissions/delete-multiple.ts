// Models
import RolePermission from "@db/models/RolePermission";

export interface ServiceData {
  ids: number[];
}

const deleteMultiple = async (data: ServiceData) => {
  const permissionsPromise = data.ids.map((id) => {
    return RolePermission.deleteSingle({
      id: id,
    });
  });

  const permissions = await Promise.all(permissionsPromise);

  return permissions;
};

export default deleteMultiple;
