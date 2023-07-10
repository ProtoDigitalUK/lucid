export interface FormSubmissionResT {
    id: number;
    form_key: string;
    environment_key: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    fields: Array<{
        type: string;
        name: string;
        label: string;
        placeholder?: string;
        options?: Array<{
            label: string;
            value: string;
        }>;
        show_in_table?: boolean;
        value: string | number | boolean;
    }>;
}
declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<FormSubmissionResT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: FormSubmissionResT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<FormSubmissionResT>;
    toggleReadAt: (data: import("./toggle-read-at").ServiceData) => Promise<FormSubmissionResT>;
    format: (form: import("../../../../form-builder/src").default, data: {
        submission: import("../../db/models/FormSubmission").FormSubmissionsT;
        data: import("../../db/models/FormSubmission").FormDataT[];
    }) => FormSubmissionResT;
    submitForm: (props: import("./submit-form").ServiceData) => Promise<FormSubmissionResT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map