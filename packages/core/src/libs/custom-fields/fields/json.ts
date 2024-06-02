import CustomFieldConfig from "../cf-config.js";
import Formatter from "../../formatters/index.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class Config extends CustomFieldConfig<"json"> {
	type = "json" as const;
	column = "json_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"json">) {
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
		} satisfies CFConfig<"json">;
	}
	static responseValueFormat(config: CFConfig<"json">, data: FieldProp) {
		return {
			value:
				Formatter.parseJSON<Record<string, unknown>>(data.json_value) ??
				config.default ??
				null,
			meta: null,
		} satisfies CFResponse<"json">;
	}
}

// -----------------------------------------------
// Export
const JsonCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default JsonCF;
