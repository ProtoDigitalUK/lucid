import CustomFieldConfig from "../cf-config.js";
import mediaHelpers from "../../../utils/media-helpers.js";
import type { MediaType } from "../../../types.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

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
	static responseValueFormat(data: FieldProp, host: string) {
		return {
			value: data?.media_id ?? null,
			meta: {
				id: data?.media_id ?? null,
				url: mediaHelpers.createURL(host, data?.media_key ?? ""),
				key: data?.media_key ?? null,
				mimeType: data?.media_mime_type ?? null,
				fileExtension: data?.media_file_extension ?? null,
				fileSize: data?.media_file_size ?? null,
				width: data?.media_width ?? null,
				height: data?.media_height ?? null,
				titleTranslations: data?.media_title_translations?.map((t) => ({
					value: t.value,
					localeCode: t.locale_code,
				})),
				altTranslations: data?.media_alt_translations?.map((t) => ({
					value: t.value,
					localeCode: t.locale_code,
				})),
				type: (data?.media_type as MediaType) ?? null,
			},
		} satisfies CFResponse<"media">;
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
