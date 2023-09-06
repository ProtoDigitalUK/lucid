"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatPermissions = (permissions) => {
    return {
        global: [
            permissions.users,
            permissions.roles,
            permissions.media,
            permissions.settings,
            permissions.environment,
            permissions.emails,
        ],
        environment: [
            permissions.content,
            permissions.category,
            permissions.menu,
            permissions.form_submissions,
        ],
    };
};
exports.default = formatPermissions;
//# sourceMappingURL=format-permissions.js.map