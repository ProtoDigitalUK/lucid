import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class CheckboxCustomField extends CustomField<"checkbox"> {
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
	responseValueFormat(props: {
		config: CFConfig<"checkbox">;
		data: FieldProp;
	}) {
		return {
			value: props.data.bool_value ?? props.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"checkbox">;
	}
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
}

export default CheckboxCustomField;
