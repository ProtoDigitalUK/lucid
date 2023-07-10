// Services
import { FormT } from "@services/forms";
import FormBuilder from "@lucid/form-builder";

const formatForm = (instance: FormBuilder): FormT => {
  return {
    key: instance.key,
    title: instance.options.title,
    description: instance.options.description || null,
    fields: instance.options.fields,
  };
};

export default formatForm;
