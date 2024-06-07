import CustomField from "../custom-field.js";
import Formatter from "../../formatters/index.js";
import type { LinkValue } from "../../../types.js";
import type { CFConfig, CFProps, CFResponse, CFInsertItem } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";
import type { LinkReferenceData } from "../../../types.js";

class LinkCustomField extends CustomField<"link"> {
	type = "link" as const;
	column = "text_value" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"link">) {
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
			translations: this.props?.translations ?? false,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"link">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		// TODO: move type
		const linkVal = Formatter.parseJSON<LinkValue>(props.data.json_value);
		return {
			value: {
				url: linkVal?.url ?? this.config.default ?? null,
				label: linkVal?.label ?? null,
				target: linkVal?.target ?? null,
			},
			meta: null,
		} satisfies CFResponse<"link">;
	}
	getInsertField(props: {
		item: FieldInsertItem;
		brickId: number;
		groupId: number;
	}) {
		// TODO: move type
		const value = props.item.value as LinkValue | undefined;

		return {
			key: this.config.key,
			type: this.config.type,
			localeCode: props.item.localeCode,
			collectionBrickId: props.brickId,
			groupId: props.groupId,
			textValue: value ? value.url : null,
			intValue: null,
			boolValue: null,
			jsonValue: value
				? Formatter.stringifyJSON({
						target: value.target,
						label: value.label,
					})
				: null,
			mediaId: null,
			userId: null,
		} satisfies CFInsertItem<"link">;
	}
	typeValidation(value: string, relationData: LinkReferenceData) {
		if (!relationData) return { valid: true };
		if (!relationData.target) return { valid: true };

		const allowedValues = ["_self", "_blank"];

		if (!allowedValues.includes(relationData.target)) {
			return {
				valid: false,
				message: `Please set the target to one of the following: ${allowedValues.join(
					", ",
				)}.`,
			};
		}

		return {
			valid: true,
		};
	}
}

export default LinkCustomField;
