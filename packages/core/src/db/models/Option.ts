import getDBClient from "@db/db";
import { LucidError, modelErrors } from "@utils/app/error-handler";

// -------------------------------------------
// Types
type OptionNames = "initial_user_created" | "media_storage_used";
type OptionTypes = "boolean" | "string" | "number" | "json";
type OptionValue = boolean | number | string | object | Array<any>;

type OptionGetByName = (name: OptionNames) => Promise<OptionT>;

type OptionPatchByName = (data: {
  name: OptionNames;
  value: OptionValue;
  type: OptionTypes;
}) => Promise<OptionT>;

type OptionCreate = (data: {
  name: OptionNames;
  value: OptionValue;
  type: OptionTypes;
}) => Promise<OptionT>;

type OptionCreateOrPatchByName = (data: {
  name: OptionNames;
  value: OptionValue;
  type: OptionTypes;
}) => Promise<OptionT>;

// -------------------------------------------
// User
export type OptionT = {
  option_name: OptionNames;
  option_value: OptionValue;
  type: OptionTypes;

  created_at: string;
  updated_at: string;
};

export default class Option {
  // -------------------------------------------
  // Functions
  static getByName: OptionGetByName = async (name) => {
    const client = await getDBClient;

    const options = await client.query<OptionT>({
      text: `SELECT * FROM lucid_options WHERE option_name = $1`,
      values: [name],
    });

    if (!options.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Option Not Found",
        message: "There was an error finding the option.",
        status: 500,
        errors: modelErrors({
          option_name: {
            code: "not_found",
            message: "Option not found.",
          },
        }),
      });
    }

    return Option.convertToType(options.rows[0]);
  };
  static patchByName: OptionPatchByName = async (data) => {
    const client = await getDBClient;

    const value = Option.convertToString(data.value, data.type);

    const options = await client.query<OptionT>({
      text: `UPDATE lucid_options SET option_value = $1, type = $2, updated_at = NOW() WHERE option_name = $3 RETURNING *`,
      values: [value, data.type, data.name],
    });

    if (!options.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Option Not Found",
        message: "There was an error patching the option.",
        status: 500,
        errors: modelErrors({
          option_name: {
            code: "not_found",
            message: "Option not found.",
          },
        }),
      });
    }

    return Option.convertToType(options.rows[0]);
  };
  static create: OptionCreate = async (data) => {
    const client = await getDBClient;

    const value = Option.convertToString(data.value, data.type);

    const optionExisting = await client.query<OptionT>({
      text: `SELECT * FROM lucid_options WHERE option_name = $1`,
      values: [data.name],
    });

    if (optionExisting.rows[0]) {
      return Option.convertToType(optionExisting.rows[0]);
    }

    const option = await client.query<OptionT>({
      text: `INSERT INTO lucid_options (option_name, option_value, type) VALUES ($1, $2, $3) RETURNING *`,
      values: [data.name, value, data.type],
    });

    if (!option.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Option Not Created",
        message: "There was an error creating the option.",
        status: 500,
      });
    }

    return Option.convertToType(option.rows[0]);
  };
  // -------------------------------------------
  // Util Functions
  static convertToType = (option: OptionT): OptionT => {
    switch (option.type) {
      case "boolean":
        option.option_value = option.option_value === "true" ? true : false;
        break;
      case "number":
        option.option_value = parseInt(option.option_value as string);
        break;
      case "json":
        option.option_value = JSON.parse(option.option_value as string);
        break;
      default:
        option.option_value;
        break;
    }
    return option;
  };
  static convertToString = (value: OptionValue, type: OptionTypes) => {
    switch (type) {
      case "boolean":
        value = value ? "true" : "false";
        break;
      case "json":
        value = JSON.stringify(value);
        break;
      default:
        value = value.toString();
        break;
    }

    return value;
  };
}
