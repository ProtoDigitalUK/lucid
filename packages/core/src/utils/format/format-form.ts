import { FormBuilderOptionsT } from "@lucid/form-builder";
// Services
import FormBuilder from "@lucid/form-builder";

// -------------------------------------------
// Types
export type FormResT = {
  key: string;
  title: string;
  description: string | null;
  fields?: FormBuilderOptionsT["fields"];
};

const formatForm = (instance: FormBuilder): FormResT => {
  return {
    key: instance.key,
    title: instance.options.title,
    description: instance.options.description || null,
    fields: instance.options.fields,
  };
};

export default formatForm;
