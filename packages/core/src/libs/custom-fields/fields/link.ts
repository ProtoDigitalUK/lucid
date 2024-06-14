import T from "../../../translations/index.js";
import CustomField from "../custom-field.js";
import Formatter from "../../formatters/index.js";
import constants from "../../../constants.js";
import type { LinkValue } from "../../../types.js";
import type {
	CFConfig,
	CFProps,
	CFResponse,
	CFInsertItem,
	LinkReferenceData,
} from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

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
		groupId: number | null;
	}) {
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

		// TODO: verify url is valid?
		// TODO: verify label is valid?

		if (
			!constants.customFields.link.targets.includes(relationData.target)
		) {
			return {
				valid: false,
				message: T("field_link_target_error_message", {
					valid: constants.customFields.link.targets.join(", "),
				}),
			};
		}

		return {
			valid: true,
		};
	}
}

export default LinkCustomField;
