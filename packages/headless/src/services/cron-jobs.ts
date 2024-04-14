import T from "../translations/index.js";
import cron from "node-cron";
import { HeadlessError } from "../utils/errors.js";
import Repository from "../libs/repositories/index.js";

const clearExpiredTokens = async (serviceConfig: ServiceConfigT) => {
	try {
		const UserTokensRepo = Repository.get("user-tokens", serviceConfig.db);

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

const registerCronJobs = async (serviceConfig: ServiceConfigT) => {
	cron.schedule("0 0 * * *", async () => {
		await clearExpiredTokens(serviceConfig);
	});
};

export default registerCronJobs;
