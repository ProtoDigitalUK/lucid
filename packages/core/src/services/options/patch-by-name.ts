import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Models
import Option, { OptionT } from "@db/models/Option.js";
// Utils
import convertToType from "@utils/options/convert-to-type.js";
import convertToString from "@utils/options/convert-to-string.js";
// Format
import formatOption from "@utils/format/format-option.js";

export interface ServiceData {
  name: OptionT["option_name"];
  value: OptionT["option_value"];
  type: OptionT["type"];
}

const patchByName = async (client: PoolClient, data: ServiceData) => {
  const value = convertToString(data.value, data.type);

  const option = await Option.patchByName(client, {
    name: data.name,
    value,
    type: data.type,
  });

  if (!option) {
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

  const convertOptionType = convertToType(option);
  return formatOption([convertOptionType]);
};

export default patchByName;
