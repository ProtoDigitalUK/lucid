import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	ids: Array<number | null>;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const TranslationKeysRepo = Repository.get(
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
