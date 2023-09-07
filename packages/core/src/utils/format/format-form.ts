// Services
import FormBuilder from "@builders/form-builder/index.js";
// Types
import { FormResT } from "@lucid/types/src/forms.js";

const formatForm = (instance: FormBuilder): FormResT => {
  return {
    key: instance.key,
    title: instance.options.title,
    description: instance.options.description || null,
    fields: instance.options.fields,
  };
};

export default formatForm;
