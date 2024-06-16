import optionsServices from "../options/index.js";
import processedImagesServices from "../processed-images/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { SettingsResponse } from "../../types/response.js";

const getSettings: ServiceFn<[], SettingsResponse> = async (service) => {
	const [mediaStorageUsedRes, processedImageCountRes] = await Promise.all([
		optionsServices.getSingle(service, {
			name: "media_storage_used",
		}),
		processedImagesServices.getCount(service),
	]);
	if (mediaStorageUsedRes.error) return mediaStorageUsedRes;
	if (processedImageCountRes.error) return processedImageCountRes;

	const SettingsFormatter = Formatter.get("settings");

	return {
		error: undefined,
		data: SettingsFormatter.formatSingle({
			settings: {
				mediaStorageUsed: mediaStorageUsedRes.data.valueInt || 0,
				processedImageCount: processedImageCountRes.data,
			},
			config: service.config,
		}),
	};
};

export default getSettings;
