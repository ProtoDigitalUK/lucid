import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig, ServiceFn } from "../../libs/services/types.js";

const defaultOptions: ServiceFn<[], undefined> = async (
	service: ServiceConfig,
) => {
	const OptionsRepo = Repository.get("options", service.db);

	const mediaStorageOption = await OptionsRepo.selectSingle({
		select: ["name"],
		where: [
			{
				key: "name",
				operator: "=",
				value: "media_storage_used",
			},
		],
	});

	if (mediaStorageOption === undefined) {
		await OptionsRepo.createSingle({
			name: "media_storage_used",
			valueInt: 0,
		});
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default defaultOptions;
