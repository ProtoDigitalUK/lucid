import z from "zod";
// Models
import Config from "@db/models/Config";
import Environment from "@db/models/Environment";
// Serices
import { LucidError } from "@utils/app/error-handler";
import FormBuilder, { FormBuilderOptionsT } from "@lucid/form-builder";
import formsSchema from "@schemas/forms";

// -------------------------------------------
// Types

type FormGetSingle = (data: {
  key: string;
  environment_key: string;
}) => Promise<FormT>;

type FormGetAll = (
  query: z.infer<typeof formsSchema.getAll.query>,
  environment_key: string
) => Promise<FormT[]>;

// -------------------------------------------
// Form
export type FormT = {
  key: string;
  title: string;
  description: string | null;
  fields?: FormBuilderOptionsT["fields"];
};

export default class Form {
  // -------------------------------------------
  // Functions
  static getSingle: FormGetSingle = async (data) => {
    // Check access
    const formInstances = Form.getFormBuilderConfig();

    if (!formInstances) {
      throw new LucidError({
        type: "basic",
        name: "Form not found",
        message: `Form with key "${data.key}" under environment "${data.environment_key}" not found`,
        status: 404,
      });
    }

    const environment = await Environment.getSingle(data.environment_key);

    const allForms = formInstances.map((form) => Form.getFormBuilderData(form));

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
  static getAll: FormGetAll = async (query, environment_key) => {
    // Check access
    const formInstances = Form.getFormBuilderConfig();
    if (!formInstances) {
      return [];
    }

    let forms = formInstances.map((form) => Form.getFormBuilderData(form));

    // Get data
    const environment = await Environment.getSingle(environment_key);

    // Filtered
    forms = Form.#filterEnvironmentForms(
      environment.assigned_forms || [],
      forms
    );

    const formsRes = forms.map((form) => {
      if (!query.include?.includes("fields")) {
        delete form.fields;
      }
      return form;
    });

    return formsRes;
  };
  // -------------------------------------------
  // Util Functions
  static getFormBuilderConfig = (): FormBuilder[] => {
    const formBuilderInstances = Config.forms;

    if (!formBuilderInstances) {
      return [];
    } else {
      return formBuilderInstances;
    }
  };
  static getFormBuilderData = (instance: FormBuilder): FormT => {
    const data: FormT = {
      key: instance.key,
      title: instance.options.title,
      description: instance.options.description || null,
      fields: instance.options.fields,
    };

    return data;
  };
  static #filterEnvironmentForms = (
    environment_forms: string[],
    forms: FormT[]
  ) => {
    return forms.filter((form) => environment_forms.includes(form.key));
  };
}
