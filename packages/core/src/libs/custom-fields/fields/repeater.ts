import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";

class RepeaterCustomField extends CustomField<"repeater"> {
	type = "repeater" as const;
	column = null;
	key;
	props;
	constructor(key: string, props?: CFProps<"repeater">) {
		super();
		this.key = key;
		this.props = props;
	}
	// Methods
	responseValueFormat() {
		return {
			value: null,
			meta: null,
		} satisfies CFResponse<"repeater">;
	}
	// Getters
	get config() {
		return {
			key: this.key,
			type: this.type,
			labels: {
				title: this.props?.labels?.title ?? super.keyToTitle(this.key),
				description: this.props?.labels?.description,
			},
			fields: [],
			validation: this.props?.validation,
		} satisfies CFConfig<"repeater">;
	}
}

export default RepeaterCustomField;
