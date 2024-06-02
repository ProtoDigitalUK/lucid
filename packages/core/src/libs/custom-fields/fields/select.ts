import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class Config extends CustomFieldConfig<"select"> {
	type = "select" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"select">) {
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
			options: this.props?.options ?? [],
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"select">;
	}
	static responseValueFormat(config: CFConfig<"select">, data: FieldProp) {
		return {
			value: data.text_value ?? config.default ?? null,
			meta: null,
		} satisfies CFResponse<"select">;
	}
}

// -----------------------------------------------
// Export
const SelectCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default SelectCF;
