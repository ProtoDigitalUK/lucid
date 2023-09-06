import { PoolClient } from "pg";
import FormBuilder from "../../builders/form-builder/index.js";
export interface ServiceData {
    environment_key: string;
    form: FormBuilder;
    data: {
        [key: string]: string | number | boolean;
    };
}
declare const submitForm: (client: PoolClient, props: ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
export declare const submitFormExternal: (props: ServiceData) => Promise<void>;
export default submitForm;
//# sourceMappingURL=submit-form.d.ts.map