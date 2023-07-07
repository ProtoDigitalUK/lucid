import getDBClient from "@db/db";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Models
import Config from "@db/models/Config";
import Environment from "@db/models/Environment";
// Serices
import FormBuilder, { FormBuilderOptionsT } from "@lucid/form-builder";

// -------------------------------------------
// Types

type FormGetSingle = (data: {
  key: string;
  environment_key: string;
}) => Promise<FormT>;

type FormGetAll = (data: { environment_key: string }) => Promise<FormT[]>;

// -------------------------------------------
// Form
export type FormT = {
  key: string;
  title: string;
  description: string | null;
  fields: FormBuilderOptionsT["fields"];
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
  static getAll: FormGetAll = async (data) => {
    return [];
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
  static #checkFormEnvrionmentPermissions = async (data: {
    key: string;
    environment_key: string;
  }) => {
    const environment = await Environment.getSingle(data.environment_key);

    const hasPerm = environment.assigned_forms?.includes(data.key);

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
}
