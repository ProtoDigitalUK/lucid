declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/format/format-form-submission").FormSubmissionResT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    toggleReadAt: (data: import("./toggle-read-at").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    submitForm: (props: import("./submit-form").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    hasEnvironmentPermission: (data: import("./has-environment-permission").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map