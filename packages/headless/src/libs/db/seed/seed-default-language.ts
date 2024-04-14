import T from "../../../translations/index.js";
import constants from "../../../constants.js";
import { HeadlessError } from "../../../utils/errors.js";
import Formatter from "../../formatters/index.js";
import Repository from "../../repositories/index.js";
import type { BooleanInt } from "../types.js";

const seedDefaultLanguages = async (serviceConfig: ServiceConfigT) => {
	try {
		const LanguagesRepo = Repository.get("languages", serviceConfig.db);

		const totalLanguagesCount = await LanguagesRepo.count();

		if (Formatter.parseCount(totalLanguagesCount?.count) > 0) return;

		await LanguagesRepo.createSingle({
			code: constants.seedDefaults.language.code,
			isDefault: constants.seedDefaults.language.is_default as BooleanInt,
			isEnabled: constants.seedDefaults.language.is_enabled as BooleanInt,
		});
	} catch (error) {
		throw new HeadlessError({
			message: T("dynamic_an_error_occurred_saving_default", {
				name: T("language").toLowerCase(),
			}),
		});
	}
};

export default seedDefaultLanguages;
