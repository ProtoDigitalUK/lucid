declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("@lucid/types/src/roles.js").RoleResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
    checkNameIsUnique: (client: import("pg").PoolClient, data: import("./check-name-unique.js").ServiceData) => Promise<never>;
    validatePermissions: (client: import("pg").PoolClient, permGroup: {
        permissions: string[];
        environment_key?: string | undefined;
    }[]) => Promise<{
        permission: import("@lucid/types/src/permissions.js").PermissionT | import("@lucid/types/src/permissions.js").EnvironmentPermissionT;
        environment_key?: string | undefined;
    }[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map