import getConfig from "../services/config.js";
import { type SettingsResT } from "@headless/types/src/settings.js";

const formatSettings = async (data: {
	mediaStorageUsed: number;
	processedImageCount: number;
}): Promise<SettingsResT> => {
	const config = await getConfig();

	return {
		media: {
			storage_used: data.mediaStorageUsed ?? null,
			storage_limit: config.media?.storageLimit ?? null,
			storage_remaining: data.mediaStorageUsed
				? (config.media?.storageLimit || 0) - data.mediaStorageUsed
				: null,
			processed_images: {
				per_image_limit: config.media?.processedImageLimit ?? null,
				total: data.processedImageCount,
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
						per_image_limit: { type: "number" },
						total: { type: "number" },
					},
				},
			},
		},
	},
};

export default formatSettings;
