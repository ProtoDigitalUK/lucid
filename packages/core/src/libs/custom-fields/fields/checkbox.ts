import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class Config extends CustomFieldConfig<"checkbox"> {
	type = "checkbox" as const;
	column = "bool_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"checkbox">) {
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
			translations: this.props?.translations ?? false,
			default: this.props?.default ?? 0,
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"checkbox">;
	}
	static responseValueFormat(config: CFConfig<"checkbox">, data: FieldProp) {
		return {
			value: data.bool_value ?? config.default ?? null,
			meta: null,
		} satisfies CFResponse<"checkbox">;
	}
}

// -----------------------------------------------
// Export
const CheckboxCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default CheckboxCF;
