import type { SettingsResT } from "../../types/response.js";
import type { Config } from "../../types/config.js";

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
			email: {
				enabled: props.config.email !== undefined,
				from: props.config.email?.from ?? null,
			},
			media: {
				enabled: props.config.media?.stategy !== undefined,
				storage_used: props.settings.mediaStorageUsed ?? null,
				storage_limit: props.config.media.storage ?? null,
				storage_remaining: props.settings.mediaStorageUsed
					? (props.config.media?.storage || 0) -
						props.settings.mediaStorageUsed
					: null,
				processed_images: {
					stored: props.config.media?.processed?.store ?? false,
					per_image_limit:
						props.config.media?.processed?.limit ?? null,
					total: props.settings.processedImageCount,
				},
			},
		};
	};
	static swagger = {
		type: "object",
		properties: {
			email: {
				type: "object",
				properties: {
					enabled: { type: "boolean" },
					from: {
						type: "object",
						nullable: true,
						properties: {
							email: { type: "string" },
							name: { type: "string" },
						},
					},
				},
			},
			media: {
				type: "object",
				properties: {
					enabled: { type: "boolean" },
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
