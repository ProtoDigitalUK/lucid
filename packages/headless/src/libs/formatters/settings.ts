import type { Config } from "../config/config-schema.js";

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

// -----------------------------------------------------
// Types

interface SettingsPropsT {
	mediaStorageUsed: number;
	processedImageCount: number;
}

export interface SettingsResT {
	media: {
		storage_used: number | null;
		storage_limit: number | null;
		storage_remaining: number | null;
		processed_images: {
			stored: boolean | null;
			per_image_limit: number | null;
			total: number | null;
		};
	};
}
