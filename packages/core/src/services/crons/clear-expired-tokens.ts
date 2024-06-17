import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

/*
    All expired tokens will be deleted from the database.
*/

const clearExpiredTokens: ServiceFn<[], undefined> = async (service) => {
	const UserTokensRepo = Repository.get("user-tokens", service.db);

	await UserTokensRepo.deleteMultiple({
		where: [
			{
				key: "expiry_date",
				operator: "<",
				value: new Date().toISOString(),
			},
		],
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default clearExpiredTokens;
