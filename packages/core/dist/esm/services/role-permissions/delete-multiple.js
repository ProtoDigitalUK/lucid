import RolePermission from "../../db/models/RolePermission.js";
const deleteMultiple = async (client, data) => {
    const permissionsPromise = data.ids.map((id) => {
        return RolePermission.deleteSingle(client, {
            id: id,
        });
    });
    const permissions = await Promise.all(permissionsPromise);
    return permissions;
};
export default deleteMultiple;
//# sourceMappingURL=delete-multiple.js.map