import RolePermission from "../../db/models/RolePermission.js";
const deleteAll = async (client, data) => {
    const permissions = await RolePermission.deleteAll(client, {
        role_id: data.role_id,
    });
    return permissions;
};
export default deleteAll;
//# sourceMappingURL=delete-all.js.map