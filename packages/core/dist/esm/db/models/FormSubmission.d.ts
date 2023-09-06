import { PoolClient } from "pg";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
type FormSubmissionCreateSingle = (client: PoolClient, data: {
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionsT>;
type FormSubmissionCreateFormData = (client: PoolClient, data: {
    form_submission_id: number;
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
}) => Promise<FormDataT>;
type FormSubmissionGetSingle = (client: PoolClient, data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionsT>;
type FormSubmissionGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: FormSubmissionsT[];
    count: number;
}>;
type FormSubmissionToggleReadAt = (client: PoolClient, data: {
    id: number;
    form_key: string;
    environment_key: string;
    read_at: Date | null;
}) => Promise<FormSubmissionsT>;
type FormSubmissionDeleteSingle = (client: PoolClient, data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionsT>;
type FormSubmissionGetAllFormData = (client: PoolClient, data: {
    submission_ids: number[];
}) => Promise<FormDataT[]>;
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
    static getAllFormData: FormSubmissionGetAllFormData;
}
export {};
//# sourceMappingURL=FormSubmission.d.ts.map