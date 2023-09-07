import { OptionT } from "@db/models/Option.js";

const convertToString = (
  value: OptionT["option_value"],
  type: OptionT["type"]
) => {
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

export default convertToString;
