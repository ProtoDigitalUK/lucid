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
    getAll: (data: import("./get-all").ServiceData) => Promise<EnvironmentResT[]>;
    migrateEnvironment: (data: import("./migrate-environment").ServiceData) => Promise<void>;
    upsertSingle: (data: import("./upsert-single").ServiceData) => Promise<EnvironmentResT>;
    format: (environment: import("../../db/models/Environment").EnvironmentT) => EnvironmentResT;
};
export default _default;
//# sourceMappingURL=index.d.ts.map