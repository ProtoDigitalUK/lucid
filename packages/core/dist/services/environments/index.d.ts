declare const _default: {
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    getAll: (client: import("pg").PoolClient) => Promise<import("../../utils/format/format-environment").EnvironmentResT[]>;
    migrateEnvironment: (data: import("./migrate-environment").ServiceData) => Promise<void>;
    upsertSingle: (client: import("pg").PoolClient, data: import("./upsert-single").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    checkKeyExists: (client: import("pg").PoolClient, data: import("./check-key-exists").ServiceData) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map