import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class ColourCustomField extends CustomField<"colour"> {
	type = "colour" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"colour">) {
		super();
		this.key = key;
		this.props = props;
	}
	// Methods
	responseValueFormat(props: {
		config: CFConfig<"colour">;
		data: FieldProp;
	}) {
		return {
			value: props.data.text_value ?? props.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"colour">;
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
			presets: this.props?.presets ?? [],
			translations: this.props?.translations ?? false,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"colour">;
	}
}

export default ColourCustomField;
