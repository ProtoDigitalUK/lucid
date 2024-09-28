import T from "../../../translations/index.js";
import z from "zod";
import CustomField from "../custom-field.js";
import merge from "lodash.merge";
import keyToTitle from "../utils/key-to-title.js";
import zodSafeParse from "../utils/zod-safe-parse.js";
import type { CFConfig, CFProps, CFResponse, CFInsertItem } from "../types.js";
import type {
	FieldProp,
	FieldFormatMeta,
} from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class SelectCustomField extends CustomField<"select"> {
	type = "select" as const;
	column = "text_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"select">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
			key: this.key,
			type: this.type,
			labels: {
				title: this.props?.labels?.title ?? keyToTitle(this.key),
				description: this.props?.labels?.description,
				placeholder: this.props?.labels?.placeholder,
			},
			translations: this.props?.translations ?? false,
			default: this.props?.default ?? "",
			options: this.props?.options ?? [],
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"select">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
		formatMeta: FieldFormatMeta;
	}) {
		return {
			value: props.data.text_value ?? this.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"select">;
	}
	getInsertField(props: {
		item: FieldInsertItem;
		brickId: number;
		groupId: number | null;
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
		} satisfies CFInsertItem<"select">;
	}
	cfSpecificValidation(value: unknown) {
		const valueSchema = z.string();

		const valueValidate = zodSafeParse(value, valueSchema);
		if (!valueValidate.valid) return valueValidate;

		if (this.config.options) {
			const optionValues = this.config.options.map((option) => option.value);
			if (!optionValues.includes(value as string)) {
				return {
					valid: false,
					message: T("please_ensure_a_valid_option_is_selected"),
				};
			}
		}

		return { valid: true };
	}
	// Getters
	get errors() {
		return merge(super.errors, {
			required: {
				message: T("select_field_required"),
			},
		});
	}
}

export default SelectCustomField;
