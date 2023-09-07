import { OptionT } from "@db/models/Option.js";
// Types
import { OptionsResT } from "@lucid/types/src/options.js";

const formatOptions = (options: OptionT[]): OptionsResT => {
  const formattedOptions: OptionsResT = {};

  options.forEach((option) => {
    formattedOptions[option.option_name] = option.option_value as any;
  });

  return formattedOptions;
};

export default formatOptions;
