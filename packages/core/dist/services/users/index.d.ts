declare const _default: {
    updateRoles: (client: import("pg").PoolClient, data: import("./update-roles").ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
    getPermissions: (client: import("pg").PoolClient, data: import("./get-permissions").ServiceData) => Promise<import("@lucid/types/src/users").UserPermissionsResT>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("@lucid/types/src/users").UserResT>;
    registerSingle: (client: import("pg").PoolClient, data: import("./register-single").ServiceData, current_user_id?: number | undefined) => Promise<import("@lucid/types/src/users").UserResT>;
    checkIfUserExists: (client: import("pg").PoolClient, data: import("./check-if-user-exists").ServiceData) => Promise<never>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("@lucid/types/src/users").UserResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("@lucid/types/src/users").UserResT[];
        count: number;
    }>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData, current_user_id?: number | undefined) => Promise<import("@lucid/types/src/users").UserResT>;
    getSingleQuery: (client: import("pg").PoolClient, data: import("./get-single-query").ServiceData) => Promise<import("../../db/models/User").UserT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map