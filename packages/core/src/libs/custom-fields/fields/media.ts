import CustomField from "../custom-field.js";
import mediaHelpers from "../../../utils/media-helpers.js";
import type { MediaType } from "../../../types.js";
import type { CFConfig, CFProps, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";

class MediaCustomField extends CustomField<"media"> {
	type = "media" as const;
	column = "media_id" as const;
	config;
	key;
	props;
	constructor(key: string, props?: CFProps<"media">) {
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
		} satisfies CFConfig<"media">;
	}
	// Methods
	responseValueFormat(props: {
		data: FieldProp;
		host: string;
	}) {
		return {
			value: props.data?.media_id ?? null,
			meta: {
				id: props.data?.media_id ?? null,
				url: mediaHelpers.createURL(
					props.host,
					props.data?.media_key ?? "",
				),
				key: props.data?.media_key ?? null,
				mimeType: props.data?.media_mime_type ?? null,
				fileExtension: props.data?.media_file_extension ?? null,
				fileSize: props.data?.media_file_size ?? null,
				width: props.data?.media_width ?? null,
				height: props.data?.media_height ?? null,
				titleTranslations: props.data?.media_title_translations?.map(
					(t) => ({
						value: t.value,
						localeCode: t.locale_code,
					}),
				),
				altTranslations: props.data?.media_alt_translations?.map(
					(t) => ({
						value: t.value,
						localeCode: t.locale_code,
					}),
				),
				type: (props.data?.media_type as MediaType) ?? null,
			},
		} satisfies CFResponse<"media">;
	}
}

export default MediaCustomField;
