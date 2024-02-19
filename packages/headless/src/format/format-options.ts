import { type HeadlessOptions } from "kysely-codegen";
import type { OptionsResT } from "@headless/types/src/options.js";

const formatOptions = (option: HeadlessOptions): OptionsResT => {
	return {
		name: option.name as OptionsResT["name"],
		value:
			option.value_text ?? option.value_int ?? option.value_bool ?? null,
	};
};

export default formatOptions;
