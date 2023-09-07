import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import environmentsService from "@services/environments/index.js";

export interface ServiceData {
  form_key: string;
  environment_key: string;
}

const hasEnvironmentPermission = async (
  client: PoolClient,
  data: ServiceData
) => {
  const environment = await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.environment_key,
  });

  const hasPerm = environment.assigned_forms?.includes(data.form_key);

  if (!hasPerm) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form is not assigned to this environment.",
      status: 403,
    });
  }

  return environment;
};

export default hasEnvironmentPermission;
