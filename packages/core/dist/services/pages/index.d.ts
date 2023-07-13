declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Page").PageT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    checkPageExists: (data: import("./check-page-exists").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    buildUniqueSlug: (data: import("./build-unique-slug").ServiceData) => Promise<string>;
    parentChecks: (data: import("./parent-checks").ServiceData) => Promise<import("../../db/models/Page").PageT>;
    resetHomepages: (data: import("./reset-homepages").ServiceData) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map