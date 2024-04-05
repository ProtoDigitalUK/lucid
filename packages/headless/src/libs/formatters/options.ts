import type { HeadlessOptions, Select } from "../db/types.js";
import type { OptionsResT } from "../../types/response.js";

export default class OptionsFormatter {
	formatSingle = (props: {
		option: Select<HeadlessOptions>;
	}): OptionsResT => {
		return {
			name: props.option.name,
			value_text: props.option.value_text,
			value_int: props.option.value_int,
			value_bool: props.option.value_bool,
		};
	};
}
