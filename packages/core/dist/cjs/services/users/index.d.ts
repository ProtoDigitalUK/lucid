declare const _default: {
    updateRoles: (client: import("pg").PoolClient, data: import("./update-roles.js").ServiceData) => Promise<import("../../db/models/UserRole.js").UserRoleT[]>;
    getPermissions: (client: import("pg").PoolClient, data: import("./get-permissions.js").ServiceData) => Promise<import("@lucid/types/src/users.js").UserPermissionsResT>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("@lucid/types/src/users.js").UserResT>;
    registerSingle: (client: import("pg").PoolClient, data: import("./register-single.js").ServiceData, current_user_id?: number | undefined) => Promise<import("@lucid/types/src/users.js").UserResT>;
    checkIfUserExists: (client: import("pg").PoolClient, data: import("./check-if-user-exists.js").ServiceData) => Promise<never>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("@lucid/types/src/users.js").UserResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("@lucid/types/src/users.js").UserResT[];
        count: number;
    }>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData, current_user_id?: number | undefined) => Promise<import("@lucid/types/src/users.js").UserResT>;
    getSingleQuery: (client: import("pg").PoolClient, data: import("./get-single-query.js").ServiceData) => Promise<import("../../db/models/User.js").UserT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map