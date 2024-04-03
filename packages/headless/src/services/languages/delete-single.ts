import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import { parseCount } from "../../utils/helpers.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const LanguagesRepo = RepositoryFactory.getRepository(
		"languages",
		serviceConfig.db,
	);

	const languagesCountQuery = await LanguagesRepo.count();
	const count = parseCount(languagesCountQuery?.count);

	if (count === 1) {
		throw new APIError({
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
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("language"),
			}),
			message: T("deletion_error_message", {
				name: T("language"),
			}),
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
			throw new APIError({
				type: "basic",
				name: T("error_not_deleted_name", {
					name: T("language"),
				}),
				message: T("deletion_error_message", {
					name: T("language").toLowerCase(),
				}),
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
