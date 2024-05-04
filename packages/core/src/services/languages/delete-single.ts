import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const languagesCountQuery = await LanguagesRepo.count();
	const count = Formatter.parseCount(languagesCountQuery?.count);

	if (count === 1) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_min_entries_name", {
				name: T("language"),
			}),
			message: T("error_not_min_entries_message", {
				name: T("language"),
			}),
			status: 500,
		});
	}

	const deleteLanguage = await LanguagesRepo.deleteSingle({
		where: [
			{
				key: "code",
				operator: "=",
				value: data.code,
			},
		],
	});

	if (deleteLanguage === undefined) {
		throw new LucidAPIError({
			type: "basic",
			status: 404,
		});
	}

	const defaultLanguages = await LanguagesRepo.selectMultiple({
		select: ["id"],
		where: [
			{
				key: "is_default",
				operator: "=",
				value: 1,
			},
		],
	});

	if (defaultLanguages.length === 0) {
		const firstLanguage = await LanguagesRepo.selectSingle({
			select: ["id"],
			where: [],
		});
		if (firstLanguage === undefined) {
			throw new LucidAPIError({
				type: "basic",
				status: 500,
			});
		}

		if (firstLanguage) {
			await LanguagesRepo.updateSingle({
				data: {
					isDefault: 1,
					isEnabled: 1,
				},
				where: [
					{
						key: "id",
						operator: "=",
						value: firstLanguage.id,
					},
				],
			});
		}
	}
};

export default getSingle;
