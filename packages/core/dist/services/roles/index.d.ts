declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Role").RoleT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("../../db/models/Role").RoleT>;
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