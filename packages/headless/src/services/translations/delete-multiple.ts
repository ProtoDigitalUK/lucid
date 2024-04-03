import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	ids: Array<number | null>;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const TranslationKeysRepo = RepositoryFactory.getRepository(
		"translation-keys",
		serviceConfig.db,
	);

	await TranslationKeysRepo.deleteMultiple({
		where: [
			{
				key: "id",
				operator: "in",
				value: data.ids.filter((id) => id !== null),
			},
		],
	});
};

export default deleteMultiple;
