import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class RepeaterCustomField extends CustomField<"repeater"> {
	type = "repeater" as const;
	column = null;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"repeater">) {
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
			validation: this.props?.validation,
		} satisfies CFConfig<"repeater">;
	}
	// Methods
	responseValueFormat() {
		return {
			value: null,
			meta: null,
		} satisfies CFResponse<"repeater">;
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

export default RepeaterCustomField;
