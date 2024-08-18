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
import type { BooleanInt } from "../../db/types.js";

class CheckboxCustomField extends CustomField<"checkbox"> {
	type = "checkbox" as const;
	column = "bool_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"checkbox">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
			key: this.key,
			type: this.type,
			labels: {
				title: this.props?.labels?.title ?? keyToTitle(this.key),
				description: this.props?.labels?.description,
			},
			translations: this.props?.translations ?? false,
			default: this.props?.default ?? 0,
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"checkbox">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
		formatMeta: FieldFormatMeta;
	}) {
		return {
			value: props.data.bool_value ?? this.config.default ?? null,
			meta: null,
		} satisfies CFResponse<"checkbox">;
	}
	getInsertField(props: {
		item: FieldInsertItem;
		brickId: number;
		groupId: number | null;
	}) {
		let value: BooleanInt | undefined = props.item.value;
		if (typeof value === "string") {
			value = value === "true" ? 1 : 0;
		} else if (typeof value === "boolean") {
			value = value ? 1 : 0;
		} else if (typeof value === "number") {
			value = value === 1 ? 1 : 0;
		} else {
			value = undefined;
		}

		return {
			key: this.config.key,
			type: this.config.type,
			localeCode: props.item.localeCode,
			collectionBrickId: props.brickId,
			groupId: props.groupId,
			textValue: null,
			intValue: null,
			boolValue: value,
			jsonValue: null,
			mediaId: null,
			userId: null,
		} satisfies CFInsertItem<"checkbox">;
	}
	cfSpecificValidation(value: unknown) {
		const valueSchema = z.union([z.literal(1), z.literal(0), z.boolean()]);

		const valueValidate = zodSafeParse(value, valueSchema);
		if (!valueValidate.valid) return valueValidate;

		return {
			valid: true,
		};
	}
	// Getters
	get errors() {
		return merge(super.errors, {
			required: {
				condition: (value: unknown) =>
					value === undefined || value === null || value === 0,
				message: T("checkbox_field_required"),
			},
		});
	}
}

export default CheckboxCustomField;
