import UserRole from "../../db/models/UserRole.js";
import formatUserPermissions from "../../utils/format/format-user-permissions.js";
const getPermissions = async (client, data) => {
    const userPermissions = await UserRole.getPermissions(client, {
        user_id: data.user_id,
    });
    if (!userPermissions) {
        return {
            roles: [],
            permissions: {
                global: [],
                environments: [],
            },
        };
    }
    return formatUserPermissions(userPermissions);
};
export default getPermissions;
//# sourceMappingURL=get-permissions.js.map