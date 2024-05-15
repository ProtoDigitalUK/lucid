import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	localeCodes: string[];
}

const checkLocalesExist = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const localeCodes = Array.from(new Set(data.localeCodes));

	if (localeCodes.length === 0) return;

	const LocalesRepo = Repository.get("locales", serviceConfig.db);

	const locales = await LocalesRepo.selectMultiple({
		select: ["code"],
		where: [
			{
				key: "code",
				operator: "in",
				value: localeCodes,
			},
			{
				key: "is_deleted",
				operator: "!=",
				value: 1,
			},
		],
	});

	if (locales.length !== localeCodes.length) {
		throw new LucidAPIError({
			type: "basic",
			status: 400,
			errorResponse: {
				body: {
					translations: {
						code: "invalid",
						message: T("make_sure_all_translations_locales_exist"),
					},
				},
			},
		});
	}
};

export default checkLocalesExist;
