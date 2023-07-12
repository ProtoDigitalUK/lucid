import z from "zod";
// Schema
import formsSchema from "@schemas/forms";
// Services
import Config from "@services/Config";
import environmentsService from "@services/environments";
// Format
import formatForm from "@utils/format/format-form";

export interface ServiceData {
  query: z.infer<typeof formsSchema.getAll.query>;
  environment_key: string;
}

const getAll = async (data: ServiceData) => {
  // Check access
  const formInstances = Config.forms || [];

  let formsRes = formInstances.map((form) => formatForm(form));

  // Get data
  const environment = await environmentsService.getSingle({
    key: data.environment_key,
  });

  // Filtered
  formsRes = formsRes.filter((form) =>
    environment.assigned_forms.includes(form.key)
  );

  formsRes = formsRes.map((form) => {
    if (!data.query.include?.includes("fields")) {
      delete form.fields;
    }
    return form;
  });

  return formsRes;
};

export default getAll;
