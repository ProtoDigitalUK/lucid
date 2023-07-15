import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Serices
import Config from "@services/Config";
import environmentsService from "@services/environments";
// Format
import formatForm from "@utils/format/format-form";

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
