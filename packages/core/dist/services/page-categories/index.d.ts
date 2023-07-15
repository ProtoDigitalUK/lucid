declare const _default: {
    createMultiple: (client: import("pg").PoolClient, data: import("./create-multiple").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
    verifyCategoriesInCollection: (client: import("pg").PoolClient, data: import("./verify-cateogies-in-collection").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
    deleteMultiple: (client: import("pg").PoolClient, data: import("./delete-multiple").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
    updateMultiple: (client: import("pg").PoolClient, data: import("./update-multiple").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map