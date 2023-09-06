import RolePermission from "../../db/models/RolePermission.js";
const getAll = async (client, data) => {
    const rolePermissions = await RolePermission.getAll(client, {
        role_id: data.role_id,
    });
    return rolePermissions;
};
export default getAll;
//# sourceMappingURL=get-all.js.map