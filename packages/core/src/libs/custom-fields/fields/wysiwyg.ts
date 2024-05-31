import CustomFieldConfig from "../cf-config.js";
import type { CustomFieldConfigT, CustomFieldPropsT } from "../types.js";

class Config extends CustomFieldConfig<"wysiwyg"> {
	type = "wysiwyg" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CustomFieldPropsT<"wysiwyg">) {
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
			translations: this.props?.translations ?? true,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CustomFieldConfigT<"wysiwyg">;
	}
}

// -----------------------------------------------
// Export
const WysiwygCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default WysiwygCF;
