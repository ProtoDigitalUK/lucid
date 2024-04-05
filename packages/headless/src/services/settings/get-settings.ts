import serviceWrapper from "../../utils/service-wrapper.js";
import optionsServices from "../../services/options/index.js";
import processedImagesServices from "../../services/processed-images/index.js";
import Formatter from "../../libs/formatters/index.js";

// export interface ServiceData {}

const getSettings = async (
	serviceConfig: ServiceConfigT,
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
			mediaStorageUsed: mediaStorageUsed.value_int || 0,
			processedImageCount: processedImageCount,
		},
		config: serviceConfig.config,
	});
};

export default getSettings;
