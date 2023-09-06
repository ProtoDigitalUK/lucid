declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("../../db/models/Category.js").CategoryT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map