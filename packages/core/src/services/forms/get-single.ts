import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serices
import Config from "@services/Config.js";
import environmentsService from "@services/environments/index.js";
// Format
import formatForm from "@utils/format/format-form.js";

export interface ServiceData {
  key: string;
  environment_key: string;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  // Check access
  const formInstances = Config.forms || [];

  const environment = await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.environment_key,
  });

  const allForms = formInstances.map((form) => formatForm(form));

  const assignedForms = environment.assigned_forms || [];

  const formData = allForms.find((c) => {
    return c.key === data.key && assignedForms.includes(c.key);
  });

  if (!formData) {
    throw new HeadlessError({
      type: "basic",
      name: "Form not found",
      message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
      status: 404,
    });
  }

  return formData;
};

export default getSingle;
