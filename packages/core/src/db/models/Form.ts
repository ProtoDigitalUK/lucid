import getDBClient from "@db/db";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Models
import Config from "@db/models/Config";
// Serices
import Environment from "./Environment";

// -------------------------------------------
// Types

type FormGetSingle = (data: {
  key: string;
  environment_key: string;
}) => Promise<{}>;

type FormGetAll = (data: { environment_key: string }) => Promise<{}[]>;

// -------------------------------------------
// Form
export type FormT = {};

export default class Form {
  // -------------------------------------------
  // Functions

  static getSingle: FormGetSingle = async (data) => {
    return {};
  };
  static getAll: FormGetAll = async (data) => {
    return [];
  };
  // -------------------------------------------
  // Util Functions
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
