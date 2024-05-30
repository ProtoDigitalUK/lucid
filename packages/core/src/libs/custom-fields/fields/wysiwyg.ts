import CustomFieldBase, { type CustomField } from "../index.js";
import type { CustomFieldData, CustomFieldConfig } from "../types.js";

export default class WysiwygCustomField
	extends CustomFieldBase<"wysiwyg">
	implements CustomField<"wysiwyg">
{
	key: string;
	config?: CustomFieldConfig<"wysiwyg">;
	constructor(key: string, config?: CustomFieldConfig<"wysiwyg">) {
		super();
		this.key = key;
		this.config = config;
	}

	// Getters
	get data(): CustomFieldData<"wysiwyg"> {
		return {
			key: this.key,
			type: "wysiwyg",
			labels: {
				title: this.config?.labels?.title ?? super.keyToTitle(this.key),
				description: this.config?.labels?.description,
				placeholder: this.config?.labels?.placeholder,
			},
			translations: this.config?.translations ?? true,
			default: this.config?.default ?? "",
			hidden: this.config?.hidden,
			disabled: this.config?.disabled,
			validation: this.config?.validation,
		};
	}
}
