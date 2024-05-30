import CustomFieldBase, { type CustomField } from "../index.js";
import type { CustomFieldData, CustomFieldConfig } from "../types.js";

export default class TextCustomField
	extends CustomFieldBase<"text">
	implements CustomField<"text">
{
	key: string;
	config?: CustomFieldConfig<"text">;
	constructor(key: string, config?: CustomFieldConfig<"text">) {
		super();
		this.key = key;
		this.config = config;
	}

	// Getters
	get data(): CustomFieldData<"text"> {
		return {
			key: this.key,
			type: "text",
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
