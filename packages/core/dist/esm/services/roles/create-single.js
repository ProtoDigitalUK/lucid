import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Role from "../../db/models/Role.js";
import roleServices from "../roles/index.js";
import rolePermServices from "../role-permissions/index.js";
import formatRole from "../../utils/format/format-roles.js";
const createSingle = async (client, data) => {
    const parsePermissions = await service(roleServices.validatePermissions, false, client)(data.permission_groups);
    await service(roleServices.checkNameIsUnique, false, client)({
        name: data.name,
    });
    const role = await Role.createSingle(client, {
        name: data.name,
        permission_groups: data.permission_groups,
    });
    if (!role) {
        throw new LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error creating the role.",
            status: 500,
        });
    }
    if (data.permission_groups.length > 0) {
        await service(rolePermServices.createMultiple, false, client)({
            role_id: role.id,
            permissions: parsePermissions,
        });
    }
    return formatRole(role);
};
export default createSingle;
//# sourceMappingURL=create-single.js.map