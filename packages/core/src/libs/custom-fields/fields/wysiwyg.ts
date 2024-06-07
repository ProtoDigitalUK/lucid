import CustomField from "../custom-field.js";
import sanitizeHtml from "sanitize-html";
import type { CFConfig, CFProps, CFResponse, CFInsertItem } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class WysiwygCustomField extends CustomField<"wysiwyg"> {
	type = "wysiwyg" as const;
	column = "text_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"wysiwyg">) {
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
			translations: this.props?.translations ?? true,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"wysiwyg">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		return {
			value: props.data.text_value ?? this.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"wysiwyg">;
	}
	getInsertField(props: {
		item: FieldInsertItem;
		brickId: number;
		groupId: number;
	}) {
		return {
			key: this.config.key,
			type: this.config.type,
			localeCode: props.item.localeCode,
			collectionBrickId: props.brickId,
			groupId: props.groupId,
			textValue: props.item.value,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			userId: null,
		} satisfies CFInsertItem<"wysiwyg">;
	}
	typeValidation(value: string) {
		const sanitizedValue = sanitizeHtml(value, {
			allowedTags: [],
			allowedAttributes: {},
		});

		if (this.config.validation?.zod) {
			const response =
				this.config.validation?.zod?.safeParse(sanitizedValue);
			if (response?.success) {
				return { valid: true };
			}

			return {
				valid: false,
				message: response?.error.message,
			};
		}

		return { valid: true };
	}
}

export default WysiwygCustomField;
