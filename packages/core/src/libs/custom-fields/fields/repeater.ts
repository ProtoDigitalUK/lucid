import CustomField from "../custom-field.js";
import keyToTitle from "../utils/key-to-title.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";

class RepeaterCustomField extends CustomField<"repeater"> {
	type = "repeater" as const;
	column = null;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"repeater">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
			key: this.key,
			type: this.type,
			labels: {
				title: this.props?.labels?.title ?? keyToTitle(this.key),
				description: this.props?.labels?.description,
			},
			disabled: this.props?.disabled,
			fields: [],
			validation: this.props?.validation,
		} satisfies CFConfig<"repeater">;
	}
	// Methods
	responseValueFormat() {
		return {
			value: null,
			meta: null,
		} satisfies CFResponse<"repeater">;
	}
	getInsertField() {
		return null;
	}
	cfSpecificValidation() {
		return {
			valid: true,
		};
	}
}

export default RepeaterCustomField;
