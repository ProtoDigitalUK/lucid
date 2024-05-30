import CustomFieldConfig from "../custom-field-config.js";
import CustomFieldService from "../custom-field-service.js";
import CustomFieldResult from "../custom-field-result.js";
import type {
	CustomFieldConfigT,
	CustomFieldPropsT,
	CustomFieldInsertItem,
} from "../types.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

// Text CF Config
class TextCustomFieldConfig extends CustomFieldConfig<"text"> {
	key: string;
	props?: CustomFieldPropsT<"text">;
	column = "text_value" as const;
	constructor(key: string, props?: CustomFieldPropsT<"text">) {
		super();
		this.key = key;
		this.props = props;
	}
	// Methods
	// Getters
	get config() {
		return {
			key: this.key,
			type: "text",
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
		} satisfies CustomFieldConfigT<"text">;
	}
}

// Text CF Service
class TextCustomFieldService extends CustomFieldService<"text"> {
	cf: TextCustomFieldConfig;
	item: FieldInsertItem;

	constructor(cf: TextCustomFieldConfig, item: FieldInsertItem) {
		super();
		this.cf = cf;
		this.item = item;
	}
	// Getters
	get getInsertField() {
		if (this.brickId === null) throw new Error("Brick ID is not set");

		return {
			key: this.cf.key,
			type: this.cf.config.type,
			localeCode: this.item.localeCode,
			collectionBrickId: this.brickId,
			groupId: this.groupId,
			textValue: this.item.value,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			userId: null,
		} satisfies CustomFieldInsertItem<"text">;
	}
}

// Text CF Result
class TextCustomFieldResult extends CustomFieldResult<"text"> {}

// -----------------------------------------------
// Export
const TextCustomField = {
	Config: TextCustomFieldConfig,
	Service: TextCustomFieldService,
	Result: TextCustomFieldResult,
};

export default TextCustomField;
