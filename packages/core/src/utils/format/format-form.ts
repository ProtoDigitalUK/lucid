// Services
import FormBuilder from "@lucid/form-builder";
// Types
import { FormResT } from "@lucid/types/src/forms";

const formatForm = (instance: FormBuilder): FormResT => {
  return {
    key: instance.key,
    title: instance.options.title,
    description: instance.options.description || null,
    fields: instance.options.fields,
  };
};

export default formatForm;
