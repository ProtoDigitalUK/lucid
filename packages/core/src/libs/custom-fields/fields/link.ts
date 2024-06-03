import CustomField from "../custom-field.js";
import Formatter from "../../formatters/index.js";
import type { LinkValue } from "../../../types.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class LinkCustomField extends CustomField<"link"> {
	type = "link" as const;
	column = "text_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"link">) {
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
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"link">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		const linkVal = Formatter.parseJSON<LinkValue>(props.data.json_value);
		return {
			value: {
				url: linkVal?.url ?? this.config.default ?? null,
				label: linkVal?.label ?? null,
				target: linkVal?.target ?? null,
			},
			meta: null,
		} satisfies CFResponse<"link">;
	}
}

export default LinkCustomField;
