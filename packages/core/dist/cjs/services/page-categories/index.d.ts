declare const _default: {
    createMultiple: (client: import("pg").PoolClient, data: import("./create-multiple.js").ServiceData) => Promise<import("../../db/models/PageCategory.js").PageCategoryT[]>;
    verifyCategoriesInCollection: (client: import("pg").PoolClient, data: import("./verify-cateogies-in-collection.js").ServiceData) => Promise<import("../../db/models/PageCategory.js").PageCategoryT[]>;
    deleteMultiple: (client: import("pg").PoolClient, data: import("./delete-multiple.js").ServiceData) => Promise<import("../../db/models/PageCategory.js").PageCategoryT[]>;
    updateMultiple: (client: import("pg").PoolClient, data: import("./update-multiple.js").ServiceData) => Promise<import("../../db/models/PageCategory.js").PageCategoryT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map