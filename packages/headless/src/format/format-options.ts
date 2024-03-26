import type { HeadlessOptions } from "kysely-codegen";
import type { OptionsResT } from "@headless/types/src/options.js";

interface FormatOptionsT {
	option: HeadlessOptions;
}

const formatOptions = (props: FormatOptionsT): OptionsResT => {
	return {
		name: props.option.name as OptionsResT["name"],
		value_text: props.option.value_text,
		value_int: props.option.value_int,
		value_bool: props.option.value_bool,
	};
};

export default formatOptions;
