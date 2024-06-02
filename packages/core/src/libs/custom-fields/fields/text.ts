import CustomFieldConfig from "../cf-config.js";
import CustomFieldService from "../cf-service.js";
import type {
	CFConfig,
	CFProps,
	CustomFieldInsertItem,
	CFResponse,
} from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

class Config extends CustomFieldConfig<"text"> {
	type = "text" as const;
	column = "text_value" as const;
	key;
	props;
	constructor(key: string, props?: CFProps<"text">) {
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
				placeholder: this.props?.labels?.placeholder,
			},
			translations: this.props?.translations ?? true,
			default: this.props?.default ?? "",
			hidden: this.props?.hidden,
			disabled: this.props?.disabled,
			validation: this.props?.validation,
		} satisfies CFConfig<"text">;
	}
	static responseValueFormat(config: CFConfig<"text">, data: FieldProp) {
		return {
			value: data.text_value ?? config.default,
			meta: null,
		} satisfies CFResponse<"text">;
	}
}

class Service extends CustomFieldService<"text"> {
	cf: Config;
	item: FieldInsertItem;

	constructor(cf: Config, item: FieldInsertItem) {
		super();
		this.cf = cf;
		this.item = item;
	}
	// Getters
	get getInsertField() {
		if (this.brickId === null) throw new Error("Brick ID is not set");

		return {
			key: this.cf.key,
			type: this.cf.config.type,
			localeCode: this.item.localeCode,
			collectionBrickId: this.brickId,
			groupId: this.groupId,
			textValue: this.item.value,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			userId: null,
		} satisfies CustomFieldInsertItem<"text">;
	}
}

// -----------------------------------------------
// Export
const TextCF = {
	Config: Config,
	Service: Service,
};

export default TextCF;
