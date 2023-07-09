"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatPermissions = (permissionRes) => {
    const roles = permissionRes
        .map((permission) => {
        return {
            id: permission.role_id,
            name: permission.role_name,
        };
    })
        .filter((role, index, self) => {
        return index === self.findIndex((r) => r.id === role.id);
    });
    const environments = [];
    const permissions = [];
    permissionRes.forEach((permission) => {
        if (permission.environment_key) {
            const env = environments.find((env) => env.key === permission.environment_key);
            if (!env) {
                environments.push({
                    key: permission.environment_key,
                    permissions: [],
                });
            }
            const permExists = env?.permissions.find((perm) => perm === permission.permission);
            if (!permExists)
                env?.permissions.push(permission.permission);
        }
        else {
            const permExists = permissions.find((perm) => perm === permission.permission);
            if (!permExists)
                permissions.push(permission.permission);
        }
    });
    return {
        roles: roles,
        permissions: {
            global: permissions,
            environments: environments,
        },
    };
};
exports.default = formatPermissions;
//# sourceMappingURL=format-permissions.js.map