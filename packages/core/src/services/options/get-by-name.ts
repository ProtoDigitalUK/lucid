import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Models
import Option, { OptionT } from "@db/models/Option.js";
// Format
import formatOption from "@utils/format/format-option.js";
// Utils
import convertToType from "@utils/options/convert-to-type.js";

export interface ServiceData {
  name: OptionT["option_name"];
}

const getByName = async (client: PoolClient, data: ServiceData) => {
  const option = await Option.getByName(client, {
    name: data.name,
  });

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

  const convertOptionType = convertToType(option);
  return formatOption([convertOptionType]);
};

export default getByName;
