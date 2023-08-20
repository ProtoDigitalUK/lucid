"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatRole = (role) => {
    let roleF = {
        id: role.id,
        name: role.name,
        created_at: role.created_at,
        updated_at: role.updated_at,
    };
    if (role.permissions) {
        roleF.permissions = role.permissions?.filter((permission) => permission.id !== null);
    }
    return roleF;
};
exports.default = formatRole;
//# sourceMappingURL=format-roles.js.map