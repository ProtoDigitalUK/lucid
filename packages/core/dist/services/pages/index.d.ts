declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Page").PageT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map