import CustomField from "../custom-field.js";
import keyToTitle from "../utils/key-to-title.js";
import type {
	CFConfig,
	CFProps,
	CFResponse,
	CFInsertItem,
	UserReferenceData,
} from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class UserCustomField extends CustomField<"user"> {
	type = "user" as const;
	column = "user_id" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"user">) {
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
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"user">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
	}) {
		return {
			value: props.data.user_id ?? null,
			meta: {
				email: props.data?.user_email ?? null,
				username: props.data?.user_username ?? null,
				firstName: props.data?.user_first_name ?? null,
				lastName: props.data?.user_last_name ?? null,
			},
		} satisfies CFResponse<"user">;
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
			textValue: null,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			userId: props.item.value,
		} satisfies CFInsertItem<"user">;
	}
	cfSpecificValidation(
		value: number | null,
		relationData: UserReferenceData,
	) {
		if (this.config.validation?.required !== true && !value)
			return { valid: true };

		if (relationData === undefined) {
			return {
				valid: false,
				message: "We couldn't find the user you selected.",
			};
		}

		return { valid: true };
	}
}

export default UserCustomField;
