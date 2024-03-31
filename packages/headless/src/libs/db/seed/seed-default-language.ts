import T from "../../../translations/index.js";
import constants from "../../../constants.js";
import { InternalError } from "../../../utils/error-handler.js";
import { parseCount } from "../../../utils/helpers.js";
import RepositoryFactory from "../../factories/repository-factory.js";
import { BooleanInt } from "../types.js";

const seedDefaultLanguages = async (serviceConfig: ServiceConfigT) => {
	try {
		const LanguagesRepo = RepositoryFactory.getRepository(
			"languages",
			serviceConfig.db,
		);

		const totalLanguagesCount = await LanguagesRepo.getCount();

		if (parseCount(totalLanguagesCount?.count) > 0) return;

		await LanguagesRepo.createSingle({
			code: constants.seedDefaults.language.code,
			isDefault: constants.seedDefaults.language.is_default as BooleanInt,
			isEnabled: constants.seedDefaults.language.is_enabled as BooleanInt,
		});
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("language").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultLanguages;
