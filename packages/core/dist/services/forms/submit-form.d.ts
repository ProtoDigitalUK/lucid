import FormBuilder from "@lucid/form-builder";
interface SubmissionPropsT {
    environment_key: string;
    form: FormBuilder;
    data: {
        [key: string]: string | number | boolean;
    };
}
export declare const submitForm: (props: SubmissionPropsT) => Promise<import("./format-form").FormSubmissionResT>;
export {};
//# sourceMappingURL=submit-form.d.ts.map