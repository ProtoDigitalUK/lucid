import z from "zod";
import { FormSubmissionResT } from "../../services/forms/format-form";
import formSubmissionsSchema from "../../schemas/form-submissions";
type FormSubmissionCreateSingle = (data: {
    id?: number;
    form_key: string;
    environment_key: string;
    data: Array<{
        name: string;
        type: "string" | "number" | "boolean";
        value: string | number | boolean;
    }>;
}) => Promise<FormSubmissionResT>;
type FormSubmissionGetSingle = (data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionResT>;
type FormSubmissionGetMultiple = (query: z.infer<typeof formSubmissionsSchema.getMultiple.query>, data: {
    form_key: string;
    environment_key: string;
}) => Promise<{
    data: FormSubmissionResT[];
    count: number;
}>;
type FormSubmissionToggleReadAt = (data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionResT>;
type FormSubmissionDeleteSingle = (data: {
    id: number;
    form_key: string;
    environment_key: string;
}) => Promise<FormSubmissionResT>;
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
    #private;
    static createSingle: FormSubmissionCreateSingle;
    static getSingle: FormSubmissionGetSingle;
    static getMultiple: FormSubmissionGetMultiple;
    static toggleReadAt: FormSubmissionToggleReadAt;
    static deleteSingle: FormSubmissionDeleteSingle;
}
export {};
//# sourceMappingURL=FormSubmission.d.ts.map