import T from "../../../translations/index.js";
import { InternalError } from "../../../utils/error-handler.js";
import RepositoryFactory from "../../factories/repository-factory.js";

const seedDefaultOptions = async (serviceConfig: ServiceConfigT) => {
	try {
		const OptionsRepo = RepositoryFactory.getRepository(
			"options",
			serviceConfig.db,
		);

		const mediaStorageOption = await OptionsRepo.getSingle({
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
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("option").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultOptions;
