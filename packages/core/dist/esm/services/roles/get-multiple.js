import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import service from "../../utils/app/service.js";
import Role from "../../db/models/Role.js";
import rolePermService from "../role-permissions/index.js";
import formatRole from "../../utils/format/format-roles.js";
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page, include } = data.query;
    const SelectQuery = new SelectQueryBuilder({
        columns: ["roles.id", "roles.name", "roles.created_at", "roles.updated_at"],
        exclude: undefined,
        filter: {
            data: filter,
            meta: {
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                role_ids: {
                    key: "id",
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const roles = await Role.getMultiple(client, SelectQuery);
    if (include && include.includes("permissions")) {
        const permissionsPromise = roles.data.map((role) => service(rolePermService.getAll, false, client)({
            role_id: role.id,
        }));
        const permissions = await Promise.all(permissionsPromise);
        roles.data = roles.data.map((role, index) => {
            return {
                ...role,
                permissions: permissions[index].map((permission) => {
                    return {
                        id: permission.id,
                        permission: permission.permission,
                        environment_key: permission.environment_key,
                    };
                }),
            };
        });
    }
    return {
        data: roles.data.map((role) => formatRole(role)),
        count: roles.count,
    };
};
export default getMultiple;
//# sourceMappingURL=get-multiple.js.map