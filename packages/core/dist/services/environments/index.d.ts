export interface EnvironmentResT {
    key: string;
    title: string;
    assigned_bricks: string[];
    assigned_collections: string[];
    assigned_forms: string[];
}
declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<EnvironmentResT>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<EnvironmentResT>;
    getAll: () => Promise<EnvironmentResT[]>;
    migrateEnvironment: (data: import("./migrate-environment").ServiceData) => Promise<void>;
    upsertSingle: (data: import("./upsert-single").ServiceData) => Promise<EnvironmentResT>;
    format: (environment: import("../../db/models/Environment").EnvironmentT) => EnvironmentResT;
    checkKeyExists: (data: import("./check-key-exists").ServiceData) => Promise<EnvironmentResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map