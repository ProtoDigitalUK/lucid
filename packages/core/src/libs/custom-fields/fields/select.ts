import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class SelectCustomField extends CustomField<"select"> {
	type = "select" as const;
	column = "text_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"select">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
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
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		return {
			value: props.data.text_value ?? this.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"select">;
	}
}

export default SelectCustomField;
