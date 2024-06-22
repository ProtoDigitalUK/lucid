import optionsServices from "../options/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { SettingsResponse } from "../../types/response.js";

const getSettings: ServiceFn<[], SettingsResponse> = async (context) => {
	const [mediaStorageUsedRes, processedImageCountRes] = await Promise.all([
		optionsServices.getSingle(context, {
			name: "media_storage_used",
		}),
		context.services.processedImage.getCount(context),
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
			config: context.config,
		}),
	};
};

export default getSettings;
