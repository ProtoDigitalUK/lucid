import serviceWrapper from "../../../utils/service-wrapper.js";
import optionsServices from "../../options/index.js";
import mediaServices from "../index.js";

export interface ServiceData {
	key: string;
	size: number;
}

const deleteObject = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const mediaStategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	const storageUsed = await serviceWrapper(optionsServices.getSingle, false)(
		serviceConfig,
		{
			name: "media_storage_used",
		},
	);

	const newStorageUsed = (storageUsed.value_int || 0) - data.size;

	await Promise.all([
		mediaStategy.deleteSingle(data.key),
		serviceWrapper(optionsServices.updateSingle, false)(serviceConfig, {
			name: "media_storage_used",
			value_int: newStorageUsed < 0 ? 0 : newStorageUsed,
		}),
	]);
};

export default deleteObject;
