declare const _default: {
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
    getAll: (client: import("pg").PoolClient) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT[]>;
    migrateEnvironment: (data: import("./migrate-environment.js").ServiceData) => Promise<void>;
    upsertSingle: (client: import("pg").PoolClient, data: import("./upsert-single.js").ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
    checkKeyExists: (client: import("pg").PoolClient, data: import("./check-key-exists.js").ServiceData) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map