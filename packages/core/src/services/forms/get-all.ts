import { PoolClient } from "pg";
import z from "zod";
// Schema
import formsSchema from "@schemas/forms.js";
// Utils
import service from "@utils/app/service.js";
// Services
import Config from "@services/Config.js";
import environmentsService from "@services/environments/index.js";
// Format
import formatForm from "@utils/format/format-form.js";

export interface ServiceData {
  query: z.infer<typeof formsSchema.getAll.query>;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
  // Check access
  const formInstances = Config.forms || [];

  let formsRes = formInstances.map((form) => formatForm(form));

  // Filter by environment
  if (data.query.filter?.environment_key) {
    const environment = await service(
      environmentsService.getSingle,
      false,
      client
    )({
      key: data.query.filter?.environment_key,
    });

    // Filtered
    formsRes = formsRes.filter((form) =>
      environment.assigned_forms.includes(form.key)
    );
  }

  formsRes = formsRes.map((form) => {
    if (!data.query.include?.includes("fields")) {
      delete form.fields;
    }
    return form;
  });

  return formsRes;
};

export default getAll;
