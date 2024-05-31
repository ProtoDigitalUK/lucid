import CustomFieldConfig from "../cf-config.js";
import type { CustomFieldConfigT, CustomFieldPropsT } from "../types.js";

class Config extends CustomFieldConfig<"colour"> {
	type = "colour" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CustomFieldPropsT<"colour">) {
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
			presets: this.props?.presets ?? [],
			translations: this.props?.translations ?? false,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CustomFieldConfigT<"colour">;
	}
}

// -----------------------------------------------
// Export
const ColourCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default ColourCF;
