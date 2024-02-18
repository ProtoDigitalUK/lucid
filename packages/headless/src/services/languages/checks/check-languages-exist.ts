export interface ServiceData {
	languageIds: number[];
}

const checkLanguagesExist = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const languages = await serviceConfig.db
		.selectFrom("headless_languages")
		.select("id")
		.where("id", "in", data.languageIds)
		.execute();

	if (languages.length !== data.languageIds.length) {
		return false;
	}

	return true;
};

export default checkLanguagesExist;
