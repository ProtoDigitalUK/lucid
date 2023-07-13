declare const _default: {
    createMultiple: (data: import("./create-multiple").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
    verifyCategoriesInCollection: (data: import("./verify-cateogies-in-collection").ServiceData) => Promise<{
        id: number;
    }[]>;
    deleteMultiple: (data: import("./delete-multiple").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
    updateMultiple: (data: import("./update-multiple").ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map