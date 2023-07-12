// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import Option, { OptionT } from "@db/models/Option";
// Utils
import convertToType from "@utils/options/convert-to-type";
import convertToString from "@utils/options/convert-to-string";

export interface ServiceData {
  name: OptionT["option_name"];
  value: OptionT["option_value"];
  type: OptionT["type"];
}

const patchByName = async (data: ServiceData) => {
  const value = convertToString(data.value, data.type);

  const option = await Option.patchByName({
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

  return convertToType(option);
};

export default patchByName;
