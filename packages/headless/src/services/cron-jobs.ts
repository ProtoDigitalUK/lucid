import T from "../translations/index.js";
import cron from "node-cron";
import { InternalError } from "../utils/error-handler.js";
import type { Config } from "../libs/config/config-schema.js";

const clearExpiredTokens = async (config: Config) => {
	try {
		await config.db.client
			.deleteFrom("headless_user_tokens")
			.where("expiry_date", "<", new Date())
			.execute();
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
