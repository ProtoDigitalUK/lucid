import type { HeadlessOptions, Select } from "../db/types.js";
import type { OptionsResT } from "../../types/response.js";

export default class OptionsFormatter {
	formatSingle = (props: {
		option: Select<HeadlessOptions>;
	}): OptionsResT => {
		return {
			name: props.option.name,
			valueText: props.option.value_text,
			valueInt: props.option.value_int,
			valueBool: props.option.value_bool,
		};
	};
}
