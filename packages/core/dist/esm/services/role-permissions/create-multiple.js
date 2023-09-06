import RolePermission from "../../db/models/RolePermission.js";
const createMultiple = async (client, data) => {
    const permissionsPromise = data.permissions.map((permission) => {
        return RolePermission.createSingle(client, {
            role_id: data.role_id,
            permission: permission.permission,
            environment_key: permission.environment_key,
        });
    });
    return await Promise.all(permissionsPromise);
};
export default createMultiple;
//# sourceMappingURL=create-multiple.js.map