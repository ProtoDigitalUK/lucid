import T from "../../../translations/index.js";
import { LucidError } from "../../../utils/error-handler.js";
import Repository from "../../repositories/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

const seedDefaultOptions = async (serviceConfig: ServiceConfig) => {
	try {
		const OptionsRepo = Repository.get("options", serviceConfig.db);

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
	} catch (error) {
		throw new LucidError({
			message: T("dynamic_an_error_occurred_saving_default", {
				name: T("option").toLowerCase(),
			}),
		});
	}
};

export default seedDefaultOptions;
