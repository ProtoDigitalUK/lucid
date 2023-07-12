declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    getAll: () => Promise<import("../../utils/format/format-environment").EnvironmentResT[]>;
    migrateEnvironment: (data: import("./migrate-environment").ServiceData) => Promise<void>;
    upsertSingle: (data: import("./upsert-single").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    checkKeyExists: (data: import("./check-key-exists").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map