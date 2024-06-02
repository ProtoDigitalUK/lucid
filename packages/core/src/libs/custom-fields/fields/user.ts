import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class Config extends CustomFieldConfig<"user"> {
	type = "user" as const;
	column = "user_id" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"user">) {
		super();
		this.key = key;
		this.props = props;
	}
	// Methods
	// Getters
	get config() {
		return {
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
	static responseValueFormat(data: FieldProp) {
		return {
			value: data.user_id ?? null,
			meta: {
				email: data?.user_email ?? null,
				username: data?.user_username ?? null,
				firstName: data?.user_first_name ?? null,
				lastName: data?.user_last_name ?? null,
			},
		} satisfies CFResponse<"user">;
	}
}

// -----------------------------------------------
// Export
const UserCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default UserCF;
