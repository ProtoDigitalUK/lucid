import T from "../../../translations/index.js";
import constants from "../../../constants.js";
import { LucidError } from "../../../utils/error-handler.js";
import Formatter from "../../formatters/index.js";
import Repository from "../../repositories/index.js";
import type { BooleanInt } from "../types.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

const seedDefaultLanguages = async (serviceConfig: ServiceConfig) => {
	try {
		const LanguagesRepo = Repository.get("languages", serviceConfig.db);

		const totalLanguagesCount = await LanguagesRepo.count();

		if (Formatter.parseCount(totalLanguagesCount?.count) > 0) return;

		await LanguagesRepo.createSingle({
			code: constants.seedDefaults.language.code,
			isDefault: constants.seedDefaults.language.isDefault as BooleanInt,
			isEnabled: constants.seedDefaults.language.isEnabled as BooleanInt,
		});
	} catch (error) {
		throw new LucidError({
			message: T("dynamic_an_error_occurred_saving_default", {
				name: T("language").toLowerCase(),
			}),
		});
	}
};

export default seedDefaultLanguages;
