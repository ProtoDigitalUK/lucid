import CustomField from "../custom-field.js";
import mediaHelpers from "../../../utils/media-helpers.js";
import type { MediaType } from "../../../types.js";
import type {
	CFConfig,
	CFProps,
	CFResponse,
	CFInsertItem,
	MediaReferenceData,
} from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../../services/collection-document-bricks/helpers/flatten-fields.js";

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
			mediaId: props.item.value,
			userId: null,
		} satisfies CFInsertItem<"media">;
	}
	typeValidation(value: number | null, relationData: MediaReferenceData) {
		if (this.config.validation?.required !== true && !value) {
			return { valid: true };
		}

		if (relationData === undefined) {
			return {
				valid: false,
				message: "We couldn't find the media you selected.",
			};
		}

		// Check if value is in the options
		if (this.config.validation?.extensions?.length) {
			const extension = relationData.extension;
			if (!this.config.validation.extensions.includes(extension)) {
				return {
					valid: false,
					message: `Media must be one of the following extensions: ${this.config.validation.extensions.join(
						", ",
					)}`,
				};
			}
		}

		// Check type
		if (this.config.validation?.type) {
			const type = relationData.type;
			if (!type) {
				return {
					valid: false,
					message: "This media does not have a type.",
				};
			}

			if (this.config.validation.type !== type) {
				return {
					valid: false,
					message: `Media must be of type "${this.config.validation.type}".`,
				};
			}
		}

		// Check width
		if (this.config.validation?.width) {
			const width = relationData.width;
			if (!width) {
				return {
					valid: false,
					message: "This media does not have a width.",
				};
			}

			if (
				this.config.validation.width.min &&
				width < this.config.validation.width.min
			) {
				return {
					valid: false,
					message: `Media width must be greater than ${this.config.validation.width.min}px.`,
				};
			}
			if (
				this.config.validation.width.max &&
				width > this.config.validation.width.max
			) {
				return {
					valid: false,
					message: `Media width must be less than ${this.config.validation.width.max}px.`,
				};
			}
		}

		// Check height
		if (this.config.validation?.height) {
			const height = relationData.height;
			if (!height) {
				return {
					valid: false,
					message: "This media does not have a height.",
				};
			}

			if (
				this.config.validation.height.min &&
				height < this.config.validation.height.min
			) {
				return {
					valid: false,
					message: `Media height must be greater than ${this.config.validation.height.min}px.`,
				};
			}
			if (
				this.config.validation.height.max &&
				height > this.config.validation.height.max
			) {
				return {
					valid: false,
					message: `Media height must be less than ${this.config.validation.height.max}px.`,
				};
			}
		}

		return { valid: true };
	}
}

export default MediaCustomField;
