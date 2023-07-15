declare const _default: {
    createMultiple: (client: import("pg").PoolClient, data: import("./create-multiple").ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
    deleteMultiple: (client: import("pg").PoolClient, data: import("./delete-multiple").ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
    deleteAll: (client: import("pg").PoolClient, data: import("./delete-all").ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
    getAll: (client: import("pg").PoolClient, data: import("./get-all").ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map