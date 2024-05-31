import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps } from "../types.js";

class Config extends CustomFieldConfig<"tab"> {
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

// -----------------------------------------------
// Export
const TabCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default TabCF;
