import type { HeadlessOptions } from "kysely-codegen";
import type { OptionsResT } from "@headless/types/src/options.js";

const formatOptions = (option: HeadlessOptions): OptionsResT => {
	return {
		name: option.name as OptionsResT["name"],
		value_text: option.value_text,
		value_int: option.value_int,
		value_bool: option.value_bool,
	};
};

export default formatOptions;
