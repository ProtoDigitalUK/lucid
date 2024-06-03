import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class TextareaCustomField extends CustomField<"textarea"> {
	type = "textarea" as const;
	column = "text_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"textarea">) {
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
			translations: this.props?.translations ?? true,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"textarea">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		return {
			value: props.data.text_value ?? this.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"textarea">;
	}
}

export default TextareaCustomField;
