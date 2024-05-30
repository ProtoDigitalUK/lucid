import CustomFieldBase, { type CustomField } from "../index.js";
import type { CustomFieldData, CustomFieldConfig } from "../types.js";

export default class TabCustomField
	extends CustomFieldBase<"tab">
	implements CustomField<"tab">
{
	key: string;
	config?: CustomFieldConfig<"tab">;
	constructor(key: string, config?: CustomFieldConfig<"tab">) {
		super();
		this.key = key;
		this.config = config;
	}

	// Getters
	get data(): CustomFieldData<"tab"> {
		return {
			key: this.key,
			type: "tab",
			labels: {
				title: this.config?.labels?.title ?? super.keyToTitle(this.key),
				description: this.config?.labels?.description,
			},
		};
	}
}
