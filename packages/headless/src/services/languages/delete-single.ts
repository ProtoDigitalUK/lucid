import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const languagesCountQuery = await LanguagesRepo.count();
	const count = Formatter.parseCount(languagesCountQuery?.count);

	if (count === 1) {
		throw new HeadlessAPIError({
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
		throw new HeadlessAPIError({
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
			throw new HeadlessAPIError({
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
