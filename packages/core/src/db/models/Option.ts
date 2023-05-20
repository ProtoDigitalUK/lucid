import sql from "@db/db";
import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types
type OptionNames = "initial_user_created";
type OptionTypes = "boolean" | "string" | "number" | "json";
type OptionValue = boolean | number | string | object | Array<any>;

interface OptionPatchByName {
  name: OptionNames;
  value: OptionValue;
  type: OptionTypes;
  locked: boolean;
}
interface OptionCreate {
  name: OptionNames;
  value: OptionValue;
  type: OptionTypes;
  locked: boolean;
}

// -------------------------------------------
// User
export type OptionsT = {
  id: string;
  option_name: OptionNames;
  option_value: OptionValue;
  type: OptionTypes;
  locked: boolean;
  created_at: string;
  updated_at: string;
};

export default class Option {
  // -------------------------------------------
  // Methods
  static getByName = async (name: OptionNames) => {
    const [option]: [OptionsT?] = await sql`
        SELECT * FROM lucid_options WHERE option_name = ${name}
        `;

    if (!option) {
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

    return Option.convertToType(option);
  };
  static patchByName = async (data: OptionPatchByName) => {
    const value = Option.convertToString(data.value, data.type);

    const [option]: [OptionsT?] = await sql`
        UPDATE lucid_options 
        SET option_value = ${value},
            type = ${data.type},
            updated_at = NOW(),
            locked = ${data.locked || false}
        WHERE option_name = ${data.name} 
        AND locked = false
        RETURNING *`;

    if (!option) {
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

    return Option.convertToType(option);
  };
  static create = async (data: OptionCreate) => {
    const value = Option.convertToString(data.value, data.type);

    const [optionExisting]: [OptionsT?] =
      await sql`SELECT * FROM lucid_options WHERE option_name = ${data.name}`;

    if (optionExisting) return Option.convertToType(optionExisting);

    const [option]: [OptionsT?] = await sql`
        INSERT INTO lucid_options
        (option_name, option_value, type, locked)
        VALUES
        (${data.name}, ${value}, ${data.type}, ${data.locked || false})
        RETURNING *
        `;

    if (!option) {
      throw new LucidError({
        type: "basic",
        name: "Option Not Created",
        message: "There was an error creating the option.",
        status: 500,
      });
    }

    return Option.convertToType(option);
  };
  static createOrPatch = async (data: OptionPatchByName) => {
    try {
      // try to patch
      const option = await Option.patchByName(data);
      return option;
    } catch (err) {
      // if patch fails, create
      const option = await Option.create(data);
      return option;
    }
  };
  // -------------------------------------------
  // Util Methods
  static convertToType = (option: OptionsT) => {
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
