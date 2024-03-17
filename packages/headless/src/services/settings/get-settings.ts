import serviceWrapper from "../../utils/app/service-wrapper.js";
import optionsServices from "../../services/options/index.js";
import processedImagesServices from "../../services/processed-images/index.js";
import formatSettings from "../../format/format-settings.js";

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

	return await formatSettings({
		mediaStorageUsed: mediaStorageUsed.value_int || 0,
		processedImageCount: processedImageCount,
	});
};

export default getSettings;
