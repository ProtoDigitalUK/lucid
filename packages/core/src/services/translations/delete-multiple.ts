import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const deleteMultiple: ServiceFn<
	[
		{
			ids: Array<number | null>;
		},
	],
	undefined
> = async (service, data) => {
	const TranslationKeysRepo = Repository.get("translation-keys", service.db);

	await TranslationKeysRepo.deleteMultiple({
		where: [
			{
				key: "id",
				operator: "in",
				value: data.ids.filter((id) => id !== null),
			},
		],
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default deleteMultiple;
