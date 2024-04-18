import serviceWrapper from "../../utils/service-wrapper.js";
import optionsServices from "../options/index.js";
import processedImagesServices from "../processed-images/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

// export interface ServiceData {}

const getSettings = async (
	serviceConfig: ServiceConfig,
	// data: ServiceData,
) => {
	const [mediaStorageUsed, processedImageCount] = await Promise.all([
		serviceWrapper(optionsServices.getSingle, false)(serviceConfig, {
			name: "media_storage_used",
		}),
		serviceWrapper(processedImagesServices.getCount, false)(serviceConfig),
	]);

	const SettingsFormatter = Formatter.get("settings");

	return SettingsFormatter.formatSingle({
		settings: {
			mediaStorageUsed: mediaStorageUsed.valueInt || 0,
			processedImageCount: processedImageCount,
		},
		config: serviceConfig.config,
	});
};

export default getSettings;
