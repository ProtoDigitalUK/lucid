declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("../../db/models/Page.js").PageT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
    checkPageExists: (client: import("pg").PoolClient, data: import("./check-page-exists.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
    buildUniqueSlug: (client: import("pg").PoolClient, data: import("./build-unique-slug.js").ServiceData) => Promise<string>;
    parentChecks: (client: import("pg").PoolClient, data: import("./parent-checks.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
    resetHomepages: (client: import("pg").PoolClient, data: import("./reset-homepages.js").ServiceData) => Promise<void>;
    getMultipleById: (client: import("pg").PoolClient, data: import("./get-multiple-by-id.js").ServiceData) => Promise<import("../../db/models/Page.js").PageT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map