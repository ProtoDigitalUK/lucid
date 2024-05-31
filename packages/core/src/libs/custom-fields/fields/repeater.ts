import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps } from "../types.js";

class Config extends CustomFieldConfig<"repeater"> {
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

// -----------------------------------------------
// Export
const RepeaterCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default RepeaterCF;
