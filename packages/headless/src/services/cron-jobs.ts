import T from "../translations/index.js";
import cron from "node-cron";
import { InternalError } from "../utils/error-handler.js";
import type { Config } from "../libs/config/config-schema.js";
import RepositoryFactory from "../libs/factories/repository-factory.js";

const clearExpiredTokens = async (config: Config) => {
	try {
		const userTokensRepo = RepositoryFactory.getRepository(
			"user-tokens",
			config,
		);

		await userTokensRepo.deleteSingle({
			where: [
				{
					key: "expiry_date",
					operator: "<",
					value: new Date().toISOString(),
				},
			],
		});
	} catch (error) {
		throw new InternalError(T("an_error_occurred_clearing_expired_tokens"));
	}
};

const registerCronJobs = (config: Config) => {
	cron.schedule("0 0 * * *", async () => {
		await clearExpiredTokens(config);
	});
};

export default registerCronJobs;
