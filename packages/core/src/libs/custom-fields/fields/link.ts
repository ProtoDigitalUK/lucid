import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps } from "../types.js";

class Config extends CustomFieldConfig<"link"> {
	type = "link" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"link">) {
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
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"link">;
	}
}

// -----------------------------------------------
// Export
const LinkCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default LinkCF;
