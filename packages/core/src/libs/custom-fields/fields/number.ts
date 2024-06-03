import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class NumberCustomField extends CustomField<"number"> {
	type = "number" as const;
	column = "int_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"number">) {
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
			default: this.props?.default,
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"number">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		return {
			value: props.data.int_value ?? this.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"number">;
	}
}

export default NumberCustomField;
