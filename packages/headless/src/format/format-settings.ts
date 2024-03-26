import getConfig from "../libs/config/get-config.js";
import type { SettingsResT } from "@headless/types/src/settings.js";

interface FormatSettingsT {
	mediaStorageUsed: number;
	processedImageCount: number;
}

const formatSettings = async (
	props: FormatSettingsT,
): Promise<SettingsResT> => {
	const config = await getConfig();

	return {
		media: {
			storage_used: props.mediaStorageUsed ?? null,
			storage_limit: config.media?.storageLimit ?? null,
			storage_remaining: props.mediaStorageUsed
				? (config.media?.storageLimit || 0) - props.mediaStorageUsed
				: null,
			processed_images: {
				stored: config.media?.processedImages?.store ?? false,
				per_image_limit: config.media?.processedImages?.limit ?? null,
				total: props.processedImageCount,
			},
		},
	};
};

export const swaggerSettingsRes = {
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

export default formatSettings;
