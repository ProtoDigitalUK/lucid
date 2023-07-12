import FormBuilder from "@lucid/form-builder";
export interface ServiceData {
    environment_key: string;
    form: FormBuilder;
    data: {
        [key: string]: string | number | boolean;
    };
}
declare const submitForm: (props: ServiceData) => Promise<import("../../utils/format/format-form-submission").FormSubmissionResT>;
export default submitForm;
//# sourceMappingURL=submit-form.d.ts.map