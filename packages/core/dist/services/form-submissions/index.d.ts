declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../utils/forms/format-form").FormSubmissionResT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/forms/format-form").FormSubmissionResT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/forms/format-form").FormSubmissionResT>;
    toggleReadAt: (data: import("./toggle-read-at").ServiceData) => Promise<import("../../utils/forms/format-form").FormSubmissionResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map