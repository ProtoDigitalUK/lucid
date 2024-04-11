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
				storage: {
					total: props.config.media.storage,
					remaining:
						props.config.media.storage -
						props.settings.mediaStorageUsed,
					used: props.settings.mediaStorageUsed,
				},
				processed: {
					stored: props.config.media.processed.store,
					image_limit: props.config.media.processed.limit,
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
					storage: {
						type: "object",
						properties: {
							total: { type: "number" },
							remaining: { type: "number", nullable: true },
							used: { type: "number", nullable: true },
						},
					},
					processed: {
						type: "object",
						properties: {
							stored: { type: "boolean" },
							image_limit: { type: "number" },
							total: { type: "number", nullable: true },
						},
					},
				},
			},
		},
	};
}
