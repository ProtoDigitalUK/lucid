// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import Option, { OptionT } from "@db/models/Option";
// Utils
import convertToType from "@utils/options/convert-to-type";

export interface ServiceData {
  name: OptionT["option_name"];
}

const getByName = async (data: ServiceData) => {
  const option = await Option.getByName(data.name);

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

  return convertToType(option);
};

export default getByName;
