declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Page").PageT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    checkPageExists: (client: import("pg").PoolClient, data: import("./check-page-exists").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    buildUniqueSlug: (client: import("pg").PoolClient, data: import("./build-unique-slug").ServiceData) => Promise<string>;
    parentChecks: (client: import("pg").PoolClient, data: import("./parent-checks").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    resetHomepages: (client: import("pg").PoolClient, data: import("./reset-homepages").ServiceData) => Promise<void>;
    getMultipleById: (client: import("pg").PoolClient, data: import("./get-multiple-by-id").ServiceData) => Promise<import("../../db/models/Page").PageT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map