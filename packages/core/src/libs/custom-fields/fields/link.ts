import CustomFieldConfig from "../cf-config.js";
import Formatter from "../../formatters/index.js";
import type { LinkValue } from "../../../types.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

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
	static responseValueFormat(config: CFConfig<"link">, data: FieldProp) {
		const linkVal = Formatter.parseJSON<LinkValue>(data.json_value);
		return {
			value: {
				url: linkVal?.url ?? config.default ?? null,
				label: linkVal?.label ?? null,
				target: linkVal?.target ?? null,
			},
			meta: null,
		} satisfies CFResponse<"link">;
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
