declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Category").CategoryT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map