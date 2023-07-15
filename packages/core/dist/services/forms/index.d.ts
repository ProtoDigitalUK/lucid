declare const _default: {
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-form").FormResT>;
    getAll: (client: import("pg").PoolClient, data: import("./get-all").ServiceData) => Promise<import("../../utils/format/format-form").FormResT[]>;
    getBuilderInstance: (data: import("./get-builder-instance").ServiceData) => import("../../../../form-builder/src").default;
};
export default _default;
//# sourceMappingURL=index.d.ts.map