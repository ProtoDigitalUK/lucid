import { FormDataT, FormSubmissionsT } from "../../db/models/FormSubmission";
import FormBuilder from "@lucid/form-builder";
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
export declare const formatFormSubmission: (form: FormBuilder, data: {
    submission: FormSubmissionsT;
    data: FormDataT[];
}) => FormSubmissionResT;
//# sourceMappingURL=format-form.d.ts.map