declare const _default: {
    updateRoles: (data: import("./update-roles").ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
    getAllRoles: (data: import("./get-all-roles").ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
    getPermissions: (data: import("./get-permissions").ServiceData) => Promise<import("../../utils/format/format-user-permissions").UserPermissionsResT>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
    registerSingle: (data: import("./register-single").ServiceData, current_user_id?: number | undefined) => Promise<import("../../utils/format/format-user").UserResT>;
    registerSuperAdmin: (data: import("./register-superadmin").ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
    checkIfUserExists: (data: import("./check-if-user-exists").ServiceData) => Promise<never>;
    updatePassword: (data: import("./update-password").ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map