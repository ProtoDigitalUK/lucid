// Services
import Config from "@services/Config";
// Utils
import { LucidError } from "@utils/app/error-handler";

export interface ServiceData {
  form_key: string;
}

const getBuilderInstance = (data: ServiceData) => {
  const FormBuilderInstances = Config.forms || [];

  const form = FormBuilderInstances.find((form) => form.key === data.form_key);

  if (!form) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "Form not found.",
      status: 404,
    });
  }

  return form;
};

export default getBuilderInstance;
