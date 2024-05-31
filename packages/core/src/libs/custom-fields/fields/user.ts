import CustomFieldConfig from "../cf-config.js";
import type { CustomFieldConfigT, CustomFieldPropsT } from "../types.js";

class Config extends CustomFieldConfig<"user"> {
	type = "user" as const;
	column = "user_id" as const;
	key;
	props;
	constructor(key: string, props?: CustomFieldPropsT<"user">) {
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
		} satisfies CustomFieldConfigT<"user">;
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
