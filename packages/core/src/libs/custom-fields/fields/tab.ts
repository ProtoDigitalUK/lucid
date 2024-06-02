import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";

class TabCustomField extends CustomField<"tab"> {
	type = "tab" as const;
	column = null;
	key: string;
	props?: CFProps<"tab">;
	constructor(key: string, props?: CFProps<"tab">) {
		super();
		this.key = key;
		this.props = props;
	}
	// Methods
	responseValueFormat() {
		return {
			value: null,
			meta: null,
		} satisfies CFResponse<"tab">;
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
		} satisfies CFConfig<"tab">;
	}
}

export default TabCustomField;
