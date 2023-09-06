import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import UserRole from "../../db/models/UserRole.js";
import roleServices from "../roles/index.js";
const updateRoles = async (client, data) => {
    const userRoles = await UserRole.getAll(client, {
        user_id: data.user_id,
    });
    const newRoles = data.role_ids.filter((role) => {
        return !userRoles.find((userRole) => userRole.role_id === role);
    });
    if (newRoles.length > 0) {
        const rolesRes = await service(roleServices.getMultiple, false, client)({
            query: {
                filter: {
                    role_ids: newRoles.map((role) => role.toString()),
                },
            },
        });
        if (rolesRes.count !== newRoles.length) {
            throw new LucidError({
                type: "basic",
                name: "Role Error",
                message: "One or more of the roles do not exist.",
                status: 500,
            });
        }
        await UserRole.updateRoles(client, {
            user_id: data.user_id,
            role_ids: newRoles,
        });
    }
    const rolesToRemove = userRoles.filter((userRole) => {
        return !data.role_ids.find((role) => role === userRole.role_id);
    });
    if (rolesToRemove.length > 0) {
        const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
        await UserRole.deleteMultiple(client, {
            user_id: data.user_id,
            role_ids: rolesToRemoveIds,
        });
    }
    const updatedUserRoles = await UserRole.getAll(client, {
        user_id: data.user_id,
    });
    return updatedUserRoles;
};
export default updateRoles;
//# sourceMappingURL=update-roles.js.map