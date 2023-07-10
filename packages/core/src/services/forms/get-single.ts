// Models
import Config from "@db/models/Config";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Serices
import environments from "@services/environments";
import forms from "@services/forms";

export interface ServiceData {
  key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  // Check access
  const formInstances = Config.forms || [];

  const environment = await environments.getSingle({
    key: data.environment_key,
  });

  const allForms = formInstances.map((form) => forms.format(form));

  const assignedForms = environment.assigned_forms || [];

  const formData = allForms.find((c) => {
    return c.key === data.key && assignedForms.includes(c.key);
  });

  if (!formData) {
    throw new LucidError({
      type: "basic",
      name: "Form not found",
      message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
      status: 404,
    });
  }

  return formData;
};

export default getSingle;
