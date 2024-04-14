import T from "../translations/index.js";
import type { Config } from "../types/config.js";
import cron from "node-cron";
import { HeadlessError } from "../utils/errors.js";
import Repository from "../libs/repositories/index.js";

const clearExpiredTokens = async (config: Config) => {
	try {
		const UserTokensRepo = Repository.get("user-tokens", config.db.client);

		await UserTokensRepo.deleteMultiple({
			where: [
				{
					key: "expiry_date",
					operator: "<",
					value: new Date().toISOString(),
				},
			],
		});
	} catch (error) {
		throw new HeadlessError({
			message: T("an_error_occurred_clearing_expired_tokens"),
		});
	}
};

const registerCronJobs = (config: Config) => {
	cron.schedule("0 0 * * *", async () => {
		await clearExpiredTokens(config);
	});
};

export default registerCronJobs;
