declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/menus/format-menu").MenuRes[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/menus/format-menu").MenuRes>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map