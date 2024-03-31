import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	id?: number;
}

const getSingleFallback = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const LanguagesRepo = RepositoryFactory.getRepository(
		"languages",
		serviceConfig.db,
	);

	if (data.id !== undefined) {
		const language = await LanguagesRepo.getSingle({
			select: ["id", "code"],
			where: [
				{
					key: "id",
					operator: "=",
					value: data.id,
				},
			],
		});

		if (language === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_found_name", {
					name: T("language"),
				}),
				message: T("error_not_found_message", {
					name: T("language"),
				}),
				status: 404,
			});
		}

		return {
			id: language.id,
			code: language.code,
		};
	}

	const defaultLanguage = await LanguagesRepo.getSingle({
		select: ["id", "code"],
		where: [
			{
				key: "is_default",
				operator: "=",
				value: 1,
			},
		],
	});

	if (defaultLanguage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("language"),
			}),
			message: T("error_not_found_message", {
				name: T("language"),
			}),
			status: 404,
		});
	}

	return {
		id: defaultLanguage.id,
		code: defaultLanguage.code,
	};
};

export default getSingleFallback;
