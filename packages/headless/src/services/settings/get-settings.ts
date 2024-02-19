import serviceWrapper from "../../utils/app/service-wrapper.js";
import optionsServices from "../../services/options/index.js";
import mediaServices from "../../services/media/index.js";
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
		serviceWrapper(mediaServices.processedImageCount, false)(serviceConfig),
	]);

	return await formatSettings({
		mediaStorageUsed: mediaStorageUsed.value as number,
		processedImageCount: processedImageCount,
	});
};

export default getSettings;
