import CustomField from "../custom-field.js";
import keyToTitle from "../utils/key-to-title.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";

class TabCustomField extends CustomField<"tab"> {
	type = "tab" as const;
	column = null;
	config;
	key: string;
	props?: CFProps<"tab">;
	constructor(key: string, props?: CFProps<"tab">) {
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
			fields: [],
		} satisfies CFConfig<"tab">;
	}
	// Methods
	responseValueFormat() {
		return {
			value: null,
			meta: null,
		} satisfies CFResponse<"tab">;
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

export default TabCustomField;
