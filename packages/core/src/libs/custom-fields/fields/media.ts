import CustomFieldConfig from "../cf-config.js";
import type { CFConfig, CFProps } from "../types.js";

class Config extends CustomFieldConfig<"media"> {
	type = "media" as const;
	column = "media_id" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"media">) {
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
		} satisfies CFConfig<"media">;
	}
}

// -----------------------------------------------
// Export
const MediaCF = {
	Config: Config,
	Service: undefined,
	Result: undefined,
};

export default MediaCF;
