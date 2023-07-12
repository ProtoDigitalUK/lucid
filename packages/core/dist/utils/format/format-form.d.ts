import { FormBuilderOptionsT } from "@lucid/form-builder";
import FormBuilder from "@lucid/form-builder";
export type FormResT = {
    key: string;
    title: string;
    description: string | null;
    fields?: FormBuilderOptionsT["fields"];
};
declare const formatForm: (instance: FormBuilder) => FormResT;
export default formatForm;
//# sourceMappingURL=format-form.d.ts.map