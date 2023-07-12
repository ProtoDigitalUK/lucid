import { OptionT } from "@db/models/Option";

const convertToType = (option: OptionT): OptionT => {
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

export default convertToType;
