declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("@lucid/types/src/roles").RoleResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("@lucid/types/src/roles").RoleResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("@lucid/types/src/roles").RoleResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("@lucid/types/src/roles").RoleResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("@lucid/types/src/roles").RoleResT>;
    checkNameIsUnique: (client: import("pg").PoolClient, data: import("./check-name-unique").ServiceData) => Promise<never>;
    validatePermissions: (client: import("pg").PoolClient, permGroup: {
        permissions: string[];
        environment_key?: string | undefined;
    }[]) => Promise<{
        permission: import("../Permissions").PermissionT | import("../Permissions").EnvironmentPermissionT;
        environment_key?: string | undefined;
    }[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map