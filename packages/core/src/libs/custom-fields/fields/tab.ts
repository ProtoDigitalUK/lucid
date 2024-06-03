import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse, CFInsertItem } from "../types.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class TabCustomField extends CustomField<"tab"> {
	type = "tab" as const;
	column = null;
	config;
	key: string;
	props?: CFProps<"tab">;
	constructor(key: string, props?: CFProps<"tab">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
			key: this.key,
			type: this.type,
			labels: {
				title: this.props?.labels?.title ?? super.keyToTitle(this.key),
				description: this.props?.labels?.description,
			},
			fields: [],
		} satisfies CFConfig<"tab">;
	}
	// Methods
	responseValueFormat() {
		return {
			value: null,
			meta: null,
		} satisfies CFResponse<"tab">;
	}
	getInsertField() {
		return null;
	}
	typeValidation() {
		return {
			valid: true,
		};
	}
}

export default TabCustomField;
