import CustomField from "../custom-field.js";
import type {
	CFConfig,
	CFProps,
	CustomFieldInsertItem,
	CFResponse,
} from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class TextCustomField extends CustomField<"text"> {
	type = "text" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"text">) {
		super();
		this.key = key;
		this.props = props;
	}
	// Methods
	responseValueFormat(props: {
		config: CFConfig<"text">;
		data: FieldProp;
	}) {
		return {
			value: props.data.text_value ?? props.config.default,
			meta: null,
		} satisfies CFResponse<"text">;
	}
	getInsertField(props: {
		config: CFConfig<"text">;
		item: FieldInsertItem;
		brickId: number;
		groupId: number;
	}) {
		return {
			key: props.config.key,
			type: props.config.type,
			localeCode: props.item.localeCode,
			collectionBrickId: props.brickId,
			groupId: props.groupId,
			textValue: props.item.value,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			userId: null,
		} satisfies CustomFieldInsertItem<"text">;
	}
	// Getters
	get config() {
		return {
			key: this.key,
			type: this.type,
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
		} satisfies CFConfig<"text">;
	}
}

export default TextCustomField;
