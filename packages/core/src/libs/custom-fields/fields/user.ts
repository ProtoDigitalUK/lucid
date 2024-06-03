import CustomField from "../custom-field.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

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
				title: this.props?.labels?.title ?? super.keyToTitle(this.key),
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
}

export default UserCustomField;
