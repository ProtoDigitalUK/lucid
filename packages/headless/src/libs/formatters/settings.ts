import type { Config } from "../config/config-schema.js";
import type { SettingsResT } from "../../types/response.js";

interface SettingsPropsT {
	mediaStorageUsed: number;
	processedImageCount: number;
}

export default class SettingsFormatter {
	formatSingle = (props: {
		settings: SettingsPropsT;
		config: Config;
	}): SettingsResT => {
		return {
			media: {
				storage_used: props.settings.mediaStorageUsed ?? null,
				storage_limit: props.config.media?.storageLimit ?? null,
				storage_remaining: props.settings.mediaStorageUsed
					? (props.config.media?.storageLimit || 0) -
						props.settings.mediaStorageUsed
					: null,
				processed_images: {
					stored: props.config.media?.processedImages?.store ?? false,
					per_image_limit:
						props.config.media?.processedImages?.limit ?? null,
					total: props.settings.processedImageCount,
				},
			},
		};
	};
	static swagger = {
		type: "object",
		properties: {
			media: {
				type: "object",
				properties: {
					storage_used: { type: "number" },
					storage_limit: { type: "number" },
					storage_remaining: { type: "number" },
					processed_images: {
						type: "object",
						properties: {
							stored: { type: "boolean" },
							per_image_limit: { type: "number" },
							total: { type: "number" },
						},
					},
				},
			},
		},
	};
}
