import { SelectQueryBuilder } from "../../utils/app/query-helpers";
type FormSubmissionCreateSingle = (data: {
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionsT>;
type FormSubmissionCreateFormData = (data: {
    form_submission_id: number;
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
}) => Promise<FormDataT>;
type FormSubmissionGetSingle = (data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionsT>;
type FormSubmissionGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
    data: FormSubmissionsT[];
    count: number;
}>;
type FormSubmissionToggleReadAt = (data: {
    id: number;
    form_key: string;
    environment_key: string;
    read_at: Date | null;
}) => Promise<FormSubmissionsT>;
type FormSubmissionDeleteSingle = (data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionsT>;
export type FormSubmissionsT = {
    id: number;
    form_key: string;
    environment_key: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
};
export type FormDataT = {
    id: number;
    form_submission_id: number;
    name: string;
    text_value: string | null;
    number_value: number | null;
    boolean_value: boolean | null;
    created_at: string;
    updated_at: string;
};
export default class FormSubmission {
    static createSingle: FormSubmissionCreateSingle;
    static getSingle: FormSubmissionGetSingle;
    static getMultiple: FormSubmissionGetMultiple;
    static toggleReadAt: FormSubmissionToggleReadAt;
    static deleteSingle: FormSubmissionDeleteSingle;
    static createFormData: FormSubmissionCreateFormData;
    static getAllFormData: (submission_ids: number[]) => Promise<FormDataT[]>;
}
export {};
//# sourceMappingURL=FormSubmission.d.ts.map