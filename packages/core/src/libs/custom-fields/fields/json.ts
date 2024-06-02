import CustomField from "../custom-field.js";
import Formatter from "../../formatters/index.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class JsonCustomField extends CustomField<"json"> {
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
	responseValueFormat(props: {
		config: CFConfig<"json">;
		data: FieldProp;
	}) {
		return {
			value:
				Formatter.parseJSON<Record<string, unknown>>(
					props.data.json_value,
				) ??
				props.config.default ??
				null,
			meta: null,
		} satisfies CFResponse<"json">;
	}
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
}

export default JsonCustomField;
