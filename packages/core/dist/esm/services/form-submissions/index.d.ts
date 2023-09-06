declare const _default: {
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<import("../../utils/format/format-form-submission.js").FormSubmissionResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("../../utils/format/format-form-submission.js").FormSubmissionResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("../../utils/format/format-form-submission.js").FormSubmissionResT>;
    toggleReadAt: (client: import("pg").PoolClient, data: import("./toggle-read-at.js").ServiceData) => Promise<import("../../utils/format/format-form-submission.js").FormSubmissionResT>;
    submitForm: (client: import("pg").PoolClient, props: import("./submit-form.js").ServiceData) => Promise<import("../../utils/format/format-form-submission.js").FormSubmissionResT>;
    hasEnvironmentPermission: (client: import("pg").PoolClient, data: import("./has-environment-permission.js").ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("../../utils/format/format-form-submission.js").FormSubmissionResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map