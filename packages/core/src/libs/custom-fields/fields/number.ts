import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps } from "../types.js";

class Config extends CustomFieldConfig<"number"> {
	type = "number" as const;
	column = "int_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"number">) {
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
				placeholder: this.props?.labels?.placeholder,
			},
			translations: this.props?.translations ?? false,
			default: this.props?.default,
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"number">;
	}
}

// -----------------------------------------------
// Export
const NumberCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default NumberCF;
