declare const _default: {
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/format/format-form-submission").FormSubmissionResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    toggleReadAt: (client: import("pg").PoolClient, data: import("./toggle-read-at").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    submitForm: (client: import("pg").PoolClient, props: import("./submit-form").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
    hasEnvironmentPermission: (client: import("pg").PoolClient, data: import("./has-environment-permission").ServiceData) => Promise<import("../../utils/format/format-environment").EnvironmentResT>;
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map